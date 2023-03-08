import { Model } from "mongoose";
import { CurrencyDocument } from "../currency.schema";
import { getCryptoCurrencies, getCurrencies, getNews } from "./getActiveCurrencies";
import { NewsDocument } from "../../news/news.schema";
import { toDate } from "../../common/convertDate";
import { CurrentStatDocument } from "../currentStat.schema";
import { alpha_api } from "./aplha_api";
import { getAssetData24h } from "./getCharts";
import { Readability } from "@mozilla/readability";
import { JSDOM } from 'jsdom';
import axios from "axios";

const speed = Number(process.env.ASSETS_REFRESH_SPEED);

export const refreshCryptoCurrencies = async (currencyModel: Model<CurrencyDocument>, newsModel: Model<NewsDocument>,) => {
  const foundCurrencies = [];

  const cryptos = await getCryptoCurrencies();
  if(!cryptos) return null;

  for(let i=0; i<cryptos.length; i++) {
    await new Promise(resolve => setTimeout(resolve, speed));
    try {
      let currencyData = await alpha_api(
        "CRYPTO_INTRADAY",
        { key: "symbol", value: cryptos[i]["currency code"] },
        { key: "market", value: "USD" },
        { key: "outputsize", value: "full" },
        { key: "interval", value: "30min" }
      );
      while (currencyData.Note) {
        await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
        currencyData = await alpha_api(
          "CRYPTO_INTRADAY",
          { key: "symbol", value: cryptos[i]["currency code"] },
          { key: "market", value: "USD" },
          { key: "outputsize", value: "full" },
          { key: "interval", value: "30min" }
        );
      }

      if(!currencyData["Meta Data"]) {
        continue;
      }

      const chartSeries = currencyData["Time Series Crypto (30min)"];
      const lastItem = Object.keys(chartSeries)[0];

      const cryptoModified = {
        Symbol: "crypto-" + cryptos[i]["currency code"],
        AssetType: "Cryptocurrency",
        Name: currencyData["Meta Data"]["3. Digital Currency Name"],
        ExchangeRate: chartSeries[lastItem]["4. close"]
      };

      let foundCurrency = await currencyModel.findOne({ Symbol: cryptoModified.Symbol }).select("+news");
      if(!foundCurrency) {
        try {
          foundCurrency = new currencyModel(cryptoModified);
          await foundCurrency.save();
        } catch (err) {
          console.log(err);
          continue;
        }
      } else {
        Object.keys(cryptoModified).forEach(key => {
          if(cryptoModified[key]) {
            foundCurrency[key] = cryptoModified[key];
          }
        });
      }
      foundCurrencies.push(cryptoModified.Symbol);

      let volume24h = 0;
      let sumExchangeRate = 0;
      let lengthExchangeRate = 0;
      let avExchangeRate48h = 0;
      for(const item in chartSeries) {
        const date = new Date(item);
        if(new Date(lastItem).getTime() - date.getTime() < 86400000) {
          volume24h += Number(chartSeries[item]["5. volume"]);
        }

        if(!avExchangeRate48h && new Date().getTime() - date.getTime() >= 172800000) {
          avExchangeRate48h = sumExchangeRate / lengthExchangeRate;
        }

        if(new Date().getTime() - date.getTime() < 2628000000) {
          sumExchangeRate += Number(chartSeries[item]["4. close"]);
          lengthExchangeRate++;
          continue;
        }

        break;
      }
      const avExchangeRate = sumExchangeRate / lengthExchangeRate;
      const boomRatio = (avExchangeRate48h - avExchangeRate) / avExchangeRate * 100;
      foundCurrency.boomRatio = !isNaN(boomRatio) ? boomRatio : -1000
      foundCurrency.Volume24h = volume24h;

      const loadingNews = await loadNews(`CRYPTO:${cryptos[i]["currency code"]}`, foundCurrency, newsModel);
      if(loadingNews === "continue") continue;

      await foundCurrency.save();
    } catch (err) {
      console.log(err);
      continue;
    }
  }

  const notFoundCurrencies = await currencyModel.find({ Symbol: { $nin: foundCurrencies }, AssetType: "Cryptocurrency" });
  for(let i=0; i<notFoundCurrencies.length; i++) {
    try {
      await notFoundCurrencies[i].remove();
    } catch (err) {
      console.log(err);
    }
  }
}

function trimNewlines(text) {
  const regex = /(\s*\n\s*){2,}/g;
  const trimmedText = text.replace(regex, '\n\n');
  return trimmedText;
}
async function findMainContent(url) {
  const response = await axios.get(url);
  if(response.statusText !== "OK") {
    console.log("NOT OK")
    return null;
  }
  // console.log(response.statusText)
  const html = await response.data;

  const doc = new JSDOM(html, { url: url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  return {textContent: trimNewlines(article.textContent), content: trimNewlines(article.content)};
}

export async function loadNews(symbol: string, foundCurrency, newsModel: Model<NewsDocument>) { // symbol - `CRYPTO:${cryptos[i]["currency code"]}` / currencies[i].symbol
  try {
    const news: any = await getNews(symbol, 200);
    let lengthNews1m = 0;
    let lengthNews48h = 0;

    for(let j=0; j<news.feed.length; j++) {
      const date = toDate(news.feed[j].time_published);

      if(!lengthNews48h && new Date().getTime() - date.getTime() >= 172800000) {
        lengthNews48h = lengthNews1m;
      }
      if(new Date().getTime() - date.getTime() < 604800000) {
        lengthNews1m++;
        continue;
      }
    }

    const newsBoomRatio = (lengthNews1m - lengthNews48h) / lengthNews1m * 100;
    foundCurrency.newsBoomRatio = isNaN(newsBoomRatio) ? -1000 : newsBoomRatio;

    if(!foundCurrency.news || !foundCurrency.news.length) { // first loading news
      foundCurrency.news = [];

      for(let j=0; j<news.feed.length; j++) {
        const date = toDate(news.feed[j].time_published);
        const contents = await findMainContent(news.feed[j].url);

        const newNews = new newsModel({
          currency: foundCurrency,
          ...news.feed[j],
          ...contents,
          time_published: date,
          newsId: news.feed[j].url + news.feed[j].title,
          AssetType: symbol.includes("CRYPTO") ? "Cryptocurrency" : "Stock"
        });

        await newNews.save();
        foundCurrency.news.push(newNews);
      }

      await foundCurrency.save();
      return "continue";
    }


    let lastNews = null;
    if(foundCurrency.news.length) {
      lastNews = await newsModel.findById(foundCurrency.news[0]);
    }

    if (!news.feed || !lastNews) { // something wrong - remove news for this asset
      console.log(symbol + " --update news error (news feed doesn't exist or empty asset news array)");
      for(const newsId of foundCurrency.news) {
        try {
          const newsDocument = await newsModel.findById(newsId);
          await newsDocument.remove();
        } catch (err) {}
      }
      foundCurrency.news = [];

      await foundCurrency.save();
      return "continue";
    }

    // adding new news
    const lastNewsIndex = news.feed.findIndex(newsObj => newsObj.url + newsObj.title === lastNews.url + lastNews.title);
    if (lastNewsIndex === -1) {
      foundCurrency.news = [];
    }

    const newNewsList = news.feed.slice(0, lastNewsIndex);
    for (let j = newNewsList.length - 1; j >= 0; j--) { // adding new news to top
      const contents = await findMainContent(news.feed[j].url);

      const newNews = new newsModel({
        currency: foundCurrency,
        ...newNewsList[j],
        ...contents,
        time_published: toDate(newNewsList[j].time_published),
        newsId: news.feed[j].url + news.feed[j].title,
        AssetType: symbol.includes("CRYPTO") ? "Cryptocurrency" : "Stock"
      });
      await newNews.save();
      foundCurrency.news.unshift(newNews);
    }

  } catch (err) {
    // console.log(err)
    console.log("Error news loading");
  }

  return "ok";
}


export const refreshCurrencies = async (
  currencyModel: Model<CurrencyDocument>,
  newsModel: Model<NewsDocument>,
  currentStatModel: Model<CurrentStatDocument>
) => {
  const currencies = await getCurrencies();
  if(!currencies) return null;

  const foundCurrencies = [];
  for(let i=0; i<currencies.length; i++) {
    await new Promise(resolve => setTimeout(resolve, speed));

    let currencyData = null;
    let temporaryData = null;
    try {
      currencyData = await alpha_api("OVERVIEW", { key: "symbol", value: currencies[i].symbol });
      while(currencyData.Note) {
        await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
        currencyData = await alpha_api("OVERVIEW", { key: "symbol", value: currencies[i].symbol });
      }
      temporaryData = await getAssetData24h(currencies[i].symbol);

      if(!temporaryData) continue;
      if(!currencyData.Symbol) continue;
    } catch (err) {
      console.log(err);
      continue;
    }
    foundCurrencies.push(currencyData.Symbol);

    currencyData.IpoDate = toDate(currencies[i].ipoDate);
    currencyData.Volume24h = temporaryData.Volume24h;
    currencyData.ExchangeRate = temporaryData.ExchangeRate;
    currencyData.boomRatio = !isNaN(temporaryData.boomRatio) ? temporaryData.boomRatio : -1000;

    let foundCurrency = await currencyModel.findOne({ Symbol: currencyData.Symbol }).select("+news");

    if(!foundCurrency) {
      try {
        foundCurrency = new currencyModel(currencyData);
        await foundCurrency.save();
      } catch (err) {
        // console.log(err)
        console.log("error saving new currency");
        continue;
      }
    } else {
      Object.keys(currencyData).forEach(key => {
        if(currencyData[key]) {
          foundCurrency[key] = currencyData[key];
        }
      });
    }

    const loadingNews = await loadNews(currencyData.Symbol, foundCurrency, newsModel);
    if(loadingNews === "continue") continue;

    await foundCurrency.save();
  }

  const notFoundCurrencies = await currencyModel.find({ Symbol: { $nin: foundCurrencies }, AssetType: { $not: "Cryptocurrency" } });

  for(let i=0; i<notFoundCurrencies.length; i++) {
    try {
      await notFoundCurrencies[i].remove();
    } catch (err) {
      console.log(err);
    }
  }
}