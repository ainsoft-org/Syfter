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
        likes: number;
        dislikes: number;
        content: string;
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
        likes: number;
        dislikes: number;
        content: string;
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
