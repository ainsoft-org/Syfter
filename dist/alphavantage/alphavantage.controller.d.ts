/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { AlphavantageService } from "./alphavantage.service";
import { GetRecommendationDto } from "./dto/GetRecommendation.dto";
import { GetAssetDataDto } from "./dto/GetAssetData.dto";
import { ReactToAssetDto } from "./dto/ReactToAsset.dto";
declare class SetPriorityDto {
    assetId: string;
    priority: number;
}
declare class AssetIdDto {
    assetId: string;
}
declare class FindAssetDto {
    assets: string[];
}
export declare class AlphavantageController {
    private aplhavantageService;
    constructor(aplhavantageService: AlphavantageService);
    getRecommendation(req: any, dto: GetRecommendationDto): Promise<{
        assets: any[];
        type: string;
        amount: any;
    }>;
    getAssetData(req: any, dto: GetAssetDataDto): Promise<any[]>;
    reactToAsset(req: any, dto: ReactToAssetDto): Promise<{
        asset: import("./currency.schema").Currency;
        isLiked: boolean;
    }>;
    removeReaction(req: any, assetId: string): Promise<{
        message: string;
    }>;
    trendingNow(dto: GetRecommendationDto): Promise<{
        assets: any[];
        amount: any;
    }>;
    setPriority(dto: SetPriorityDto): Promise<import("mongoose").Document<unknown, any, import("./currency.schema").Currency> & import("./currency.schema").Currency & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    watchlist(req: any, dto: GetRecommendationDto): Promise<{
        assets: any[];
        amount: number;
    }>;
    favourites(req: any, dto: GetRecommendationDto): Promise<{
        assets: any[];
        amount: number;
    }>;
    getAssetsById(dto: FindAssetDto): Promise<any[]>;
    addToFavourites(req: any, dto: AssetIdDto): Promise<import("./currency.schema").Currency[]>;
    removeFavourite(req: any, dto: AssetIdDto): Promise<import("./currency.schema").Currency[]>;
}
export {};
