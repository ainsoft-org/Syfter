import mongoose, { HydratedDocument } from "mongoose";
import { Currency } from "../alphavantage/currency.schema";
import { User } from "../user/user.schema";
export type CommentDocument = HydratedDocument<Comment>;
export declare class Comment {
    content: string;
    author: User;
    asset: Currency;
    isReply: boolean;
    replyTo?: Comment;
    replies: Comment[];
    validate(): void;
    likes: number;
    dislikes: number;
}
export declare const CommentSchema: mongoose.Schema<Comment, mongoose.Model<Comment, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Comment>;
