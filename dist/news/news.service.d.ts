import { NewsDocument } from "./news.schema";
import mongoose, { Model } from "mongoose";
import { Cache } from "cache-manager";
import { UserDocument } from "../user/user.schema";
export declare class NewsService {
    private newsModel;
    private userModel;
    private cacheManager;
    constructor(newsModel: Model<NewsDocument>, userModel: Model<UserDocument>, cacheManager: Cache);
    likeNews(userId: string, newsId: string): Promise<{
        isLiked: boolean;
        isDisliked: boolean;
        reputation: number;
        likes: number;
        dislikes: number;
        AssetType: string;
        content: string;
        textContent: string;
        coeffLike: number;
        timePrevLike: Date;
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
        topics: {
            topic: string;
            relevance_score: number;
        };
        sentiments: mongoose.LeanDocument<{
            ticker: string;
            relevance_score: number;
            sentiment_score: number;
            sentiment_label: string;
        }>[];
        currency: import("../alphavantage/currency.schema").Currency;
        _id: mongoose.Types.ObjectId;
    }>;
    dislikeNews(userId: string, newsId: string): Promise<{
        isLiked: boolean;
        isDisliked: boolean;
        reputation: number;
        likes: number;
        dislikes: number;
        AssetType: string;
        content: string;
        textContent: string;
        coeffLike: number;
        timePrevLike: Date;
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
        topics: {
            topic: string;
            relevance_score: number;
        };
        sentiments: mongoose.LeanDocument<{
            ticker: string;
            relevance_score: number;
            sentiment_score: number;
            sentiment_label: string;
        }>[];
        currency: import("../alphavantage/currency.schema").Currency;
        _id: mongoose.Types.ObjectId;
    }>;
    getNews(userId: string, amount: number, asset?: string, filters?: any, forIgnore?: string[]): Promise<{
        news: any[];
    }>;
}
