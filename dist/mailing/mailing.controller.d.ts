import { MailingService } from "./mailing.service";
export declare class MailingController {
    private mailingService;
    constructor(mailingService: MailingService);
    sendEmailConfirmation(id: string): Promise<void>;
    confirmEmail(id: string): Promise<string>;
}
