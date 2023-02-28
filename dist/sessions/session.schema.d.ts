import mongoose, { HydratedDocument } from 'mongoose';
import { User } from "../user/user.schema";
export type SessionDocument = HydratedDocument<Session>;
export declare class Session {
    device: string;
    country: string;
    refreshToken: string;
    deviceID: string;
    user: User;
    lastActivity: Date;
}
export declare const SessionSchema: mongoose.Schema<Session, mongoose.Model<Session, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Session>;
