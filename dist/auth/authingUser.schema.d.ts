import mongoose, { HydratedDocument } from 'mongoose';
export type AuthingUserDocument = HydratedDocument<AuthingUser>;
export declare class AuthingUser {
    userID: mongoose.Schema.Types.ObjectId;
    authToken: string;
}
export declare const AuthingUserSchema: mongoose.Schema<AuthingUser, mongoose.Model<AuthingUser, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AuthingUser>;
