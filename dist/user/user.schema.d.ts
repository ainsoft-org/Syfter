import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { Address } from "../addresses/address.schema";
import { Session } from "../sessions/session.schema";
import { Currency } from "../alphavantage/currency.schema";
import { News } from "../news/news.schema";
import { Comment } from "../comments/comments.schema";
export type UserDocument = HydratedDocument<User>;
declare class Reaction {
    asset: Currency;
    isLiked: boolean;
}
export declare class SectorLikes {
    Sector: string;
    likes: number;
}
export declare class User {
    comments: Comment[];
    likedComments: Comment[];
    dislikedComments: Comment[];
    reactions: Reaction[];
    removedReactions: Currency[];
    dislikedNews: News[];
    likedNews: News[];
    removedLikedNews: News[];
    favourites: Currency[];
    likedSectors: SectorLikes[];
    mobileNumber: string;
    pin: string;
    roles: string[];
    username: string;
    email: string;
    emailConfirmed: boolean;
    acceptNotifications: boolean;
    sessions: Session[];
    sessionTerminationTimeframe: string;
    twitterId: string;
    image: string;
    lastActivity: Date;
    addresses: Address[];
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User>;
export {};
