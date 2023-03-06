import { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
import { Currency } from "../alphavantage/currency.schema";
export type NewsDocument = HydratedDocument<News>;
declare class Topic {
    topic: string;
    relevance_score: number;
}
declare class Sentiment {
    ticker: string;
    relevance_score: number;
    sentiment_score: number;
    sentiment_label: string;
}
export declare class News {
    textContent: string;
    content: string;
    likes: number;
    dislikes: number;
    coeffLike: number;
    timePrevLike: Date;
    AssetType: string;
    title: string;
    url: string;
    time_published: Date;
    authors: string[];
    summary: string;
    banner_image: string;
    source: string;
    category_within_source: string;
    source_domain: string;
    sentiment_score: number;
    sentiment_label: string;
    newsId: string;
    topics: Topic;
    sentiments: Sentiment[];
    currency: Currency;
}
export declare const NewsSchema: mongoose.Schema<News, mongoose.Model<News, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, News>;
export {};
