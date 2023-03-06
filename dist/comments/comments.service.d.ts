import { UserDocument } from "../user/user.schema";
import mongoose, { Model } from "mongoose";
import { CommentDocument, Comment } from "./comments.schema";
import { CurrencyDocument } from "../alphavantage/currency.schema";
export declare class CommentsService {
    private userModel;
    private commentModel;
    private currencyModel;
    constructor(userModel: Model<UserDocument>, commentModel: Model<CommentDocument>, currencyModel: Model<CurrencyDocument>);
    addComment(userId: string, assetId: string, content: string, replyTo?: string): Promise<any>;
    removeComment(userId: string, commentId: string): Promise<{
        message: string;
    }>;
    likeComment(userId: string, commentId: string): Promise<mongoose.Document<unknown, any, Comment> & Comment & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    dislikeComment(userId: string, commentId: string): Promise<mongoose.Document<unknown, any, Comment> & Comment & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    getIdeas(amount: number, sortBy: string, forIgnore: string[], repliesTo: string): Promise<any[]>;
}
