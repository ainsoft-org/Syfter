import { PassportSerializer } from "@nestjs/passport";
import { RegisteringUserDocument } from "../registeringUser.schema";
import { Model } from "mongoose";
export declare class SessionSerializer extends PassportSerializer {
    private regingUserModel;
    constructor(regingUserModel: Model<RegisteringUserDocument>);
    serializeUser(user: any, done: any): void;
    deserializeUser(payload: any, done: any): Promise<any>;
}
