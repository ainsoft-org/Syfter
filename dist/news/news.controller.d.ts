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
