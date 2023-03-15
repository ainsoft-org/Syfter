import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { User } from "../user/user.schema";
export type RegisteringUserDocument = HydratedDocument<RegisteringUser>;
export declare class RegisteringUser extends User {
    regToken: string;
    stage: string;
    verificationCode: string;
    sentConfirmations: number;
    prevCodeTime: Date;
    image: string;
}
export declare const RegisteringUserSchema: mongoose.Schema<RegisteringUser, mongoose.Model<RegisteringUser, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RegisteringUser>;
