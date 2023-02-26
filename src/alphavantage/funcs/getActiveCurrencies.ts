import * as csv from "csvtojson";
import { alpha_api } from "./aplha_api";
import axios from "axios";
import { toISO } from "../../common/convertDate";

class currencyDto {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
  ipoDate: string;
  delistingDate: string;
  status: string;
}

const speed = Number(process.env.ASSETS_REFRESH_SPEED);

export async function getCurrencies() {
  let response = await alpha_api("LISTING_STATUS");
  while(response.Note) {
    await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
    response = await alpha_api("LISTING_STATUS");
  }

  try {
    const currenciesJSON = await csv().fromString(response);

    return currenciesJSON;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getNews(assets: string, limit?: number, from?: Date, to?: Date) {
  let response = await alpha_api(
    "NEWS_SENTIMENT",
    { key: "tickers", value: assets },
    { key: "limit", value: limit ? limit.toString() : "" },
    { key: "time_from", value: from ? toISO(from) : "" },
    { key: "time_to", value: to ? toISO(to) : "" }
  );
  while(response.Note) {
    await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
    response = await alpha_api(
      "NEWS_SENTIMENT",
      { key: "tickers", value: assets },
      { key: "limit", value: limit ? limit.toString() : "" },
      { key: "time_from", value: from ? toISO(from) : "" },
      { key: "time_to", value: to ? toISO(to) : "" }
    );
  }

  return response;
}

export async function getCryptoCurrencies(): Promise<currencyDto[] | null> {
  let response = await axios.get('https://www.alphavantage.co/digital_currency_list/');

  while(response.data.Note) {
    await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
    response = await axios.get('https://www.alphavantage.co/digital_currency_list/');
  }

  try {
    const currenciesJSON: currencyDto[] = await csv().fromString(response.data);
    return currenciesJSON;
  } catch (err) {
    console.log(err);
    return null;
  }
}