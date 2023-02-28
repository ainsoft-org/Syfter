import { Model } from "mongoose";
import { EmailConfirmationDocument } from "../EmailConfirmation.schema";
export declare function clearEmailConfirmations(emailConfirmation: Model<EmailConfirmationDocument>): Promise<boolean>;
