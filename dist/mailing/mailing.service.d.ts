import { SESClient } from "@aws-sdk/client-ses";
import { EmailConfirmationDocument } from "./EmailConfirmation.schema";
import { User, UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
export declare class MailingService {
    private userModel;
    private emailConfirmationModel;
    constructor(userModel: Model<UserDocument>, emailConfirmationModel: Model<EmailConfirmationDocument>);
    client: SESClient;
    generateEmailConfirmation(user: User): Promise<void>;
    confirmEmail(emailConfirmationId: string): Promise<string>;
}
