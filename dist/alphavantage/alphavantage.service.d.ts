import { Cache } from 'cache-manager';
import mongoose, { Model } from "mongoose";
import { Currency, CurrencyDocument } from "./currency.schema";
import { NewsDocument } from "../news/news.schema";
import { CurrentStatDocument } from "./currentStat.schema";
import { SectorLikes, UserDocument } from "../user/user.schema";
import { FiltersDto } from "./dto/Filters.dto";
import { ReactToAssetDto } from "./dto/ReactToAsset.dto";
export declare class AlphavantageService {
    private userModel;
    private currencyModel;
    private newsModel;
    private currentStatModel;
    private cacheManager;
    constructor(userModel: Model<UserDocument>, currencyModel: Model<CurrencyDocument>, newsModel: Model<NewsDocument>, currentStatModel: Model<CurrentStatDocument>, cacheManager: Cache);
    private cryptoLogos;
    getRecommendation(userId: string, filters: FiltersDto, amount?: number, forIgnore?: string[], type?: string): Promise<{
        assets: any[];
        type: string;
        amount: any;
    }>;
    getWatchlist(userId: string, amount: number, forIgnore?: any[], filters?: {}): Promise<{
        assets: any[];
        amount: number;
    }>;
    getFavourites(userId: string, amount: number, forIgnore?: any[], filters?: {}): Promise<{
        assets: any[];
        amount: number;
    }>;
    addAssetToFavourites(userId: string, assetId: string): Promise<Currency[]>;
    removeFavourite(userId: string, assetId: string): Promise<Currency[]>;
    setAssetPriority(assetId: string, priority: number): Promise<mongoose.Document<unknown, any, Currency> & Currency & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    getTrendingNow(userId: string, amount: number, forIgnore?: any[], filters?: {}): Promise<{
        assets: any[];
        amount: number;
    }>;
    getRecByPriceIncrease(amount: any, forIgnore: any, filters: any): Promise<{
        assets: any[];
        type: string;
        amount: number;
    }>;
    getRecByNewsIncrease(amount: any, forIgnore: any, filters: any): Promise<{
        assets: any[];
        type: string;
        amount: number;
    }>;
    getReRecommendation(user: any, amount: any, forIgnore: any, filters: any): Promise<{
        assets: any[];
        type: string;
        amount: number;
    }>;
    getAssetsByIds(assetIds: any, forIgnore: any, amount: any, filters: any): Promise<any[]>;
    getAssetsBySimilarUsers(userId: string, forIgnore: any, user: any, amount: any, filters: any): Promise<{
        assets: any[];
        type: string;
        amount: number;
    }>;
    getNewCompaniesFavouriteSubcategories(amount: number, filters: any, likedSectors: SectorLikes[], forIgnore?: string[]): Promise<{
        assets: any[];
        type: string;
        amount: number;
    }>;
    getAssetsById(assets: string[]): Promise<any>;
    getAssetData(assets: any[], interval?: string, chartType?: string): Promise<any[]>;
    getFilterDispersions(): Promise<{
        minPercentChange: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        maxPercentChange: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        minMarketCap: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        maxMarketCap: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        minVolume: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        maxVolume: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        minPrice: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        maxPrice: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        minCompanyAge: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        maxCompanyAge: (mongoose.Document<unknown, any, Currency> & Currency & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
    }>;
    getAggregationFilter(filters?: any): {
        $expr: {
            $and: any[];
        };
    };
    getCalibrationAssets(amount: number, filters: any, forIgnore: string[]): Promise<{
        assets: any[];
        type: string;
        amount: any;
    }>;
    reactToAsset(dto: ReactToAssetDto, userId: string): Promise<{
        asset: Currency;
        isLiked: boolean;
    }>;
    removeReaction(assetId: string, userId: string): Promise<{
        message: string;
    }>;
}
