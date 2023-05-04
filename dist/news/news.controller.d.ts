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
import { NewsService } from "./news.service";
declare class newsIdDto {
    newsId: string;
}
declare enum periodEnum {
    "old" = "old",
    "new" = "new"
}
declare class FiltersDto {
    isCryptocurrency?: boolean;
    period?: periodEnum;
}
declare class GetNewsDto {
    forIgnore?: string[];
    amount: number;
    filters?: FiltersDto;
    asset?: string;
}
export declare class NewsController {
    private newsService;
    constructor(newsService: NewsService);
    topNews(req: any, dto: GetNewsDto): Promise<{
        news: any[];
    }>;
    likeNews(req: any, dto: newsIdDto): Promise<{
        isLiked: boolean;
        isDisliked: boolean;
        reputation: number;
        content: string;
        likes: number;
        dislikes: number;
        AssetType: string;
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
        sentiments: import("mongoose").LeanDocument<{
            ticker: string;
            relevance_score: number;
            sentiment_score: number;
            sentiment_label: string;
        }>[];
        currency: import("../alphavantage/currency.schema").Currency;
        _id: import("mongoose").Types.ObjectId;
    }>;
    dislikeNews(req: any, dto: newsIdDto): Promise<{
        isLiked: boolean;
        isDisliked: boolean;
        reputation: number;
        content: string;
        likes: number;
        dislikes: number;
        AssetType: string;
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
        sentiments: import("mongoose").LeanDocument<{
            ticker: string;
            relevance_score: number;
            sentiment_score: number;
            sentiment_label: string;
        }>[];
        currency: import("../alphavantage/currency.schema").Currency;
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export {};
