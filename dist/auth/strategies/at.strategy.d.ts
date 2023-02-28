import { Strategy } from 'passport-jwt';
import { UserDocument } from "../../user/user.schema";
import { Model } from "mongoose";
import { SessionDocument } from "../../sessions/session.schema";
declare const AtStrategy_base: new (...args: any[]) => Strategy;
export declare class AtStrategy extends AtStrategy_base {
    private userModel;
    private sessionModel;
    constructor(userModel: Model<UserDocument>, sessionModel: Model<SessionDocument>);
    validate(payload: any): Promise<any>;
}
export {};
