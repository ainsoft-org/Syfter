import { Model } from "mongoose";
import { RestoringPinUserDocument } from "../restoringPinUser.schema";
export declare function clearRestoringPinUsers(restoringPinUserModel: Model<RestoringPinUserDocument>): Promise<boolean>;
