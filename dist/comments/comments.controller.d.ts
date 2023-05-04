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
import { CommentsService } from "./comments.service";
import { AddCommentDto } from "./dto/AddComment.dto";
import { RemoveCommentDto } from "./dto/RemoveComment.dto";
import { LikeCommentDto } from "./dto/LikeComment.dto";
export declare class GetIdeasDto {
    amount: number;
    sortBy?: string;
    forIgnore: string[];
    repliesTo?: string;
    asset: string;
}
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    add(req: any, dto: AddCommentDto): Promise<any>;
    remove(req: any, dto: RemoveCommentDto): Promise<{
        message: string;
    }>;
    like(req: any, dto: LikeCommentDto): Promise<{
        reputation: number;
        isLiked: boolean;
        isDisliked: boolean;
        content: string;
        likes: number;
        dislikes: number;
        author: import("../user/user.schema").User;
        asset: import("../alphavantage/currency.schema").Currency;
        isReply: boolean;
        replyTo?: import("./comments.schema").Comment;
        replies: import("mongoose").LeanDocument<import("./comments.schema").Comment>[];
        mainComment?: import("./comments.schema").Comment;
        _id: import("mongoose").Types.ObjectId;
    }>;
    dislike(req: any, dto: LikeCommentDto): Promise<{
        reputation: number;
        isLiked: boolean;
        isDisliked: boolean;
        content: string;
        likes: number;
        dislikes: number;
        author: import("../user/user.schema").User;
        asset: import("../alphavantage/currency.schema").Currency;
        isReply: boolean;
        replyTo?: import("./comments.schema").Comment;
        replies: import("mongoose").LeanDocument<import("./comments.schema").Comment>[];
        mainComment?: import("./comments.schema").Comment;
        _id: import("mongoose").Types.ObjectId;
    }>;
    ideas(req: any, dto: GetIdeasDto): Promise<{
        ideas: any[];
        isTwitterConnected: boolean;
    }>;
}
