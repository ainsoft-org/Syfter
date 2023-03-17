"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshCurrencies = exports.loadNews = exports.refreshCryptoCurrencies = void 0;
const getActiveCurrencies_1 = require("./getActiveCurrencies");
const convertDate_1 = require("../../common/convertDate");
const aplha_api_1 = require("./aplha_api");
const getCharts_1 = require("./getCharts");
const readability_1 = require("@mozilla/readability");
const jsdom_1 = require("jsdom");
const axios_1 = require("axios");
const fs = require("fs");
const path = require("path");
const speed = Number(process.env.ASSETS_REFRESH_SPEED);
const refreshCryptoCurrencies = async (currencyModel, newsModel) => {
    const foundCurrencies = [];
    const cryptos = await (0, getActiveCurrencies_1.getCryptoCurrencies)();
    if (!cryptos)
        return null;
    const logosResponse = await axios_1.default.get(`https://rest.coinapi.io/v1/assets/icons/512?apikey=${process.env.coinAPIKey}`);
    const logos = logosResponse.data;
    const logosObj = {};
    for (let i = 0; i < logos.length; i++) {
        logosObj[logos[i].asset_id] = logos[i].url;
    }
    const saveTo = path.join(__dirname, '../../common/cryptoLogos.json');
    fs.writeFileSync(saveTo, JSON.stringify(logosObj));
    for (let i = 0; i < cryptos.length; i++) {
        await new Promise(resolve => setTimeout(resolve, speed));
        try {
            let currencyData = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: cryptos[i]["currency code"] }, { key: "market", value: "USD" }, { key: "outputsize", value: "full" }, { key: "interval", value: "30min" });
            while (currencyData.Note) {
                await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
                currencyData = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: cryptos[i]["currency code"] }, { key: "market", value: "USD" }, { key: "outputsize", value: "full" }, { key: "interval", value: "30min" });
            }
            if (!currencyData["Meta Data"]) {
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
            if (!foundCurrency) {
                try {
                    foundCurrency = new currencyModel(cryptoModified);
                    await foundCurrency.save();
                }
                catch (err) {
                    continue;
                }
            }
            else {
                Object.keys(cryptoModified).forEach(key => {
                    if (cryptoModified[key]) {
                        foundCurrency[key] = cryptoModified[key];
                    }
                });
            }
            foundCurrencies.push(cryptoModified.Symbol);
            let volume24h = 0;
            let sumExchangeRate = 0;
            let lengthExchangeRate = 0;
            let avExchangeRate48h = 0;
            for (const item in chartSeries) {
                const date = new Date(item);
                if (new Date(lastItem).getTime() - date.getTime() < 86400000) {
                    volume24h += Number(chartSeries[item]["5. volume"]);
                }
                if (!avExchangeRate48h && new Date().getTime() - date.getTime() >= 172800000) {
                    avExchangeRate48h = sumExchangeRate / lengthExchangeRate;
                }
                if (new Date().getTime() - date.getTime() < 2628000000) {
                    sumExchangeRate += Number(chartSeries[item]["4. close"]);
                    lengthExchangeRate++;
                    continue;
                }
                break;
            }
            const avExchangeRate = sumExchangeRate / lengthExchangeRate;
            const boomRatio = (avExchangeRate48h - avExchangeRate) / avExchangeRate * 100;
            foundCurrency.boomRatio = !isNaN(boomRatio) ? boomRatio : -1000;
            foundCurrency.Volume24h = volume24h;
            const loadingNews = await loadNews(`CRYPTO:${cryptos[i]["currency code"]}`, foundCurrency, newsModel);
            if (loadingNews === "continue")
                continue;
            await foundCurrency.save();
        }
        catch (err) {
            continue;
        }
    }
    const notFoundCurrencies = await currencyModel.find({ Symbol: { $nin: foundCurrencies }, AssetType: "Cryptocurrency" });
    for (let i = 0; i < notFoundCurrencies.length; i++) {
        try {
            await notFoundCurrencies[i].remove();
        }
        catch (err) {
        }
    }
};
exports.refreshCryptoCurrencies = refreshCryptoCurrencies;
function trimNewlines(text) {
    const regex = /(\s*\n\s*){2,}/g;
    const trimmedText = text.replace(regex, '\n\n');
    return trimmedText;
}
async function findMainContent(url) {
    try {
        const response = await axios_1.default.get(url);
        if (response.statusText !== "OK") {
            console.log("NOT OK");
            return null;
        }
        const html = await response.data;
        const doc = new jsdom_1.JSDOM(html, { url: url });
        const reader = new readability_1.Readability(doc.window.document);
        const article = reader.parse();
        return { textContent: trimNewlines(article.textContent), content: trimNewlines(article.content) };
    }
    catch (err) {
        return null;
    }
}
async function loadNews(symbol, foundCurrency, newsModel) {
    try {
        const news = await (0, getActiveCurrencies_1.getNews)(symbol, 200);
        let lengthNews1m = 0;
        let lengthNews48h = 0;
        for (let j = 0; j < news.feed.length; j++) {
            const date = (0, convertDate_1.toDate)(news.feed[j].time_published);
            if (!lengthNews48h && new Date().getTime() - date.getTime() >= 172800000) {
                lengthNews48h = lengthNews1m;
            }
            if (new Date().getTime() - date.getTime() < 604800000) {
                lengthNews1m++;
                continue;
            }
        }
        const newsBoomRatio = (lengthNews1m - lengthNews48h) / lengthNews1m * 100;
        foundCurrency.newsBoomRatio = isNaN(newsBoomRatio) ? -1000 : newsBoomRatio;
        if (!foundCurrency.news || !foundCurrency.news.length) {
            foundCurrency.news = [];
            for (let j = 0; j < news.feed.length; j++) {
                const date = (0, convertDate_1.toDate)(news.feed[j].time_published);
                const contents = await findMainContent(news.feed[j].url);
                if (!contents)
                    return "continue";
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
        if (foundCurrency.news.length) {
            lastNews = await newsModel.findById(foundCurrency.news[0]);
        }
        if (!news.feed || !lastNews) {
            console.log(symbol + " --update news error (news feed doesn't exist or empty asset news array)");
            for (const newsId of foundCurrency.news) {
                try {
                    const newsDocument = await newsModel.findById(newsId);
                    await newsDocument.remove();
                }
                catch (err) { }
            }
            foundCurrency.news = [];
            await foundCurrency.save();
            return "continue";
        }
        const lastNewsIndex = news.feed.findIndex(newsObj => newsObj.url + newsObj.title === lastNews.url + lastNews.title);
        if (lastNewsIndex === -1) {
            foundCurrency.news = [];
        }
        const newNewsList = news.feed.slice(0, lastNewsIndex);
        for (let j = newNewsList.length - 1; j >= 0; j--) {
            const contents = await findMainContent(news.feed[j].url);
            if (!contents)
                return "continue";
            const newNews = new newsModel({
                currency: foundCurrency,
                ...newNewsList[j],
                ...contents,
                time_published: (0, convertDate_1.toDate)(newNewsList[j].time_published),
                newsId: news.feed[j].url + news.feed[j].title,
                AssetType: symbol.includes("CRYPTO") ? "Cryptocurrency" : "Stock"
            });
            await newNews.save();
            foundCurrency.news.unshift(newNews);
        }
    }
    catch (err) {
        console.log("Error news loading");
    }
    return "ok";
}
exports.loadNews = loadNews;
const refreshCurrencies = async (currencyModel, newsModel, currentStatModel) => {
    const currencies = await (0, getActiveCurrencies_1.getCurrencies)();
    if (!currencies)
        return null;
    const foundCurrencies = [];
    for (let i = 0; i < currencies.length; i++) {
        await new Promise(resolve => setTimeout(resolve, speed));
        let currencyData = null;
        let temporaryData = null;
        try {
            currencyData = await (0, aplha_api_1.alpha_api)("OVERVIEW", { key: "symbol", value: currencies[i].symbol });
            while (currencyData.Note) {
                await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
                currencyData = await (0, aplha_api_1.alpha_api)("OVERVIEW", { key: "symbol", value: currencies[i].symbol });
            }
            temporaryData = await (0, getCharts_1.getAssetData24h)(currencies[i].symbol);
            if (!temporaryData)
                continue;
            if (!currencyData.Symbol)
                continue;
        }
        catch (err) {
            continue;
        }
        foundCurrencies.push(currencyData.Symbol);
        currencyData.IpoDate = (0, convertDate_1.toDate)(currencies[i].ipoDate);
        currencyData.Volume24h = temporaryData.Volume24h;
        currencyData.ExchangeRate = temporaryData.ExchangeRate;
        currencyData.boomRatio = !isNaN(temporaryData.boomRatio) ? temporaryData.boomRatio : -1000;
        let foundCurrency = await currencyModel.findOne({ Symbol: currencyData.Symbol }).select("+news");
        if (!foundCurrency) {
            try {
                foundCurrency = new currencyModel(currencyData);
                await foundCurrency.save();
            }
            catch (err) {
                console.log("error saving new currency");
                continue;
            }
        }
        else {
            Object.keys(currencyData).forEach(key => {
                if (currencyData[key]) {
                    foundCurrency[key] = currencyData[key];
                }
            });
        }
        const loadingNews = await loadNews(currencyData.Symbol, foundCurrency, newsModel);
        if (loadingNews === "continue")
            continue;
        await foundCurrency.save();
    }
    const notFoundCurrencies = await currencyModel.find({ Symbol: { $nin: foundCurrencies }, AssetType: { $not: "Cryptocurrency" } });
    for (let i = 0; i < notFoundCurrencies.length; i++) {
        try {
            await notFoundCurrencies[i].remove();
        }
        catch (err) {
        }
    }
};
exports.refreshCurrencies = refreshCurrencies;
//# sourceMappingURL=refreshCurrencies.js.map