import { SendEmailCommand } from "@aws-sdk/client-ses";
export declare const createEmailConfirmationCommand: (email: string, link: string) => SendEmailCommand;
