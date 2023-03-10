import { Strategy, Profile } from 'passport-twitter';
import { UserDocument } from "../../user/user.schema";
import { Model } from "mongoose";
import { SessionDocument } from "../../sessions/session.schema";
import { RegisteringUserDocument } from "../registeringUser.schema";
import { AuthService } from "../auth.service";
declare const TwitterStrategy_base: new (...args: any[]) => Strategy;
export declare class TwitterStrategy extends TwitterStrategy_base {
    private regingUserModel;
    private userModel;
    private sessionModel;
    private authService;
    constructor(regingUserModel: Model<RegisteringUserDocument>, userModel: Model<UserDocument>, sessionModel: Model<SessionDocument>, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): Promise<{
        data: {
            message: string;
            authToken: string;
        };
        status: string;
    } | {
        status: string;
        data: {
            regToken: string;
        };
    }>;
}
export {};
