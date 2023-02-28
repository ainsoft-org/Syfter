import { Model } from "mongoose";
import { RegisteringUserDocument } from "../registeringUser.schema";
export declare function clearRegisteringUsers(regingUserModel: Model<RegisteringUserDocument>): Promise<boolean>;
