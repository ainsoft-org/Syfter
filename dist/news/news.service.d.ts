import { News, NewsDocument } from "./news.schema";
import mongoose, { Model } from "mongoose";
import { Cache } from "cache-manager";
import { UserDocument } from "../user/user.schema";
export declare class NewsService {
    private newsModel;
    private userModel;
    private cacheManager;
    constructor(newsModel: Model<NewsDocument>, userModel: Model<UserDocument>, cacheManager: Cache);
    likeNews(userId: string, newsId: string): Promise<mongoose.Document<unknown, any, News> & News & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    dislikeNews(userId: string, newsId: string): Promise<mongoose.Document<unknown, any, News> & News & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    getNews(asset: string, amount: number, filters?: any, forIgnore?: string[]): Promise<any[]>;
}
