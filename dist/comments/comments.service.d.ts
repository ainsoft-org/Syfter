import { User, UserDocument } from "../user/user.schema";
import mongoose, { Model } from "mongoose";
import { CommentDocument, Comment } from "./comments.schema";
import { Currency, CurrencyDocument } from "../alphavantage/currency.schema";
export declare class CommentsService {
    private userModel;
    private commentModel;
    private currencyModel;
    constructor(userModel: Model<UserDocument>, commentModel: Model<CommentDocument>, currencyModel: Model<CurrencyDocument>);
    addComment(userId: string, assetId: string, content: string, replyTo?: string): Promise<any>;
    removeComment(userId: string, commentId: string): Promise<{
        message: string;
    }>;
    likeComment(userId: string, commentId: string): Promise<{
        reputation: number;
        isLiked: boolean;
        isDisliked: boolean;
        likes: number;
        dislikes: number;
        content: string;
        author: User;
        asset: Currency;
        isReply: boolean;
        replyTo?: Comment;
        replies: mongoose.LeanDocument<Comment>[];
        mainComment?: Comment;
        _id: mongoose.Types.ObjectId;
    }>;
    dislikeComment(userId: string, commentId: string): Promise<{
        reputation: number;
        isLiked: boolean;
        isDisliked: boolean;
        likes: number;
        dislikes: number;
        content: string;
        author: User;
        asset: Currency;
        isReply: boolean;
        replyTo?: Comment;
        replies: mongoose.LeanDocument<Comment>[];
        mainComment?: Comment;
        _id: mongoose.Types.ObjectId;
    }>;
    getIdeas(userId: string, asset: string, amount: number, sortBy: string, forIgnore: string[], repliesTo: string): Promise<{
        ideas: any[];
        isTwitterConnected: boolean;
    }>;
}
