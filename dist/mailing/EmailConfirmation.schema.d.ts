import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { User } from '../user/user.schema';
export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;
export declare class EmailConfirmation {
    user: User;
}
export declare const EmailConfirmationSchema: mongoose.Schema<EmailConfirmation, mongoose.Model<EmailConfirmation, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, EmailConfirmation>;
