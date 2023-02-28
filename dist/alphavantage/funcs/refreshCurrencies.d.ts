import { Model } from "mongoose";
import { CurrencyDocument } from "../currency.schema";
import { NewsDocument } from "../../news/news.schema";
import { CurrentStatDocument } from "../currentStat.schema";
export declare const refreshCryptoCurrencies: (currencyModel: Model<CurrencyDocument>, newsModel: Model<NewsDocument>) => Promise<any>;
export declare function loadNews(symbol: string, foundCurrency: any, newsModel: Model<NewsDocument>): Promise<"continue" | "ok">;
export declare const refreshCurrencies: (currencyModel: Model<CurrencyDocument>, newsModel: Model<NewsDocument>, currentStatModel: Model<CurrentStatDocument>) => Promise<any>;
