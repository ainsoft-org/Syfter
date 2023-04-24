import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
export type RestoringPinUserDocument = HydratedDocument<RestoringPinUser>;
export declare class RestoringPinUser {
    userID: mongoose.Schema.Types.ObjectId;
    restoreToken: string;
    verificationCode: string;
    sentConfirmations: number;
    prevCodeTime: Date;
    confirmed: boolean;
}
export declare const RestoringPinUserSchema: mongoose.Schema<RestoringPinUser, mongoose.Model<RestoringPinUser, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RestoringPinUser>;
