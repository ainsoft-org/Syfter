import { EmailConfirmationDocument } from "./EmailConfirmation.schema";
import { UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
export declare class MailingService {
    private userModel;
    private emailConfirmationModel;
    constructor(userModel: Model<UserDocument>, emailConfirmationModel: Model<EmailConfirmationDocument>);
    private clientSES;
    private clientSNS;
    generateEmailConfirmation(userId: string): Promise<void>;
    confirmEmail(emailConfirmationId: string): Promise<string>;
    generateSMSConfirmation(number: string, code: string): Promise<void>;
}
