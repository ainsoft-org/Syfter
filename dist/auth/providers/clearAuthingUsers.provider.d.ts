import { Model } from "mongoose";
import { AuthingUserDocument } from "../authingUser.schema";
export declare function clearAuthingUsers(authingUserModel: Model<AuthingUserDocument>): Promise<boolean>;
