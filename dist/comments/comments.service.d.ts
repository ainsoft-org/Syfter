import { UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
import { CommentDocument } from "./comments.schema";
import { CurrencyDocument } from "../alphavantage/currency.schema";
export declare class CommentsService {
    private userModel;
    private commentModel;
    private currencyModel;
    constructor(userModel: Model<UserDocument>, commentModel: Model<CommentDocument>, currencyModel: Model<CurrencyDocument>);
    addComment(userId: string, assetId: string, content: string, replyTo?: string): Promise<any>;
}
