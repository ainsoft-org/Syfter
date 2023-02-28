import { Model } from "mongoose";
import { SessionDocument } from "../session.schema";
import { UserDocument } from "../../user/user.schema";
export declare const deleteOutdatedSessions: (sessionModel: Model<SessionDocument>, userModel: Model<UserDocument>) => Promise<void>;
