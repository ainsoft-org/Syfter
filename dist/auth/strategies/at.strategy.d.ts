import { Strategy } from 'passport-jwt';
import { UserDocument } from "../../user/user.schema";
import { Model } from "mongoose";
import { SessionDocument } from "../../sessions/session.schema";
import { JwtService } from "@nestjs/jwt";
declare const AtStrategy_base: new (...args: any[]) => Strategy;
export declare class AtStrategy extends AtStrategy_base {
    private userModel;
    private sessionModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, sessionModel: Model<SessionDocument>, jwtService: JwtService);
    validate(payload: any): Promise<any>;
}
export {};
