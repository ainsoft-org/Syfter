import { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
import { News } from "../news/news.schema";
export type CurrencyDocument = HydratedDocument<Currency>;
export declare class Currency {
    comments: Comment[];
    likes: number;
    dislikes: number;
    news: News[];
    Symbol: string;
    AssetType: string;
    Name: string;
    Description: string;
    CIK: number;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    Address: string;
    FiscalYearEnd: string;
    LatestQuarter: string;
    MarketCapitalization: number;
    ExchangeRate: number;
    IpoDate: Date;
    Volume24h: number;
    boomRatio: number;
    percentChange24h: number;
    newsBoomRatio: number;
    priority: number;
}
export declare const CurrencySchema: mongoose.Schema<Currency, mongoose.Model<Currency, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Currency>;
