import { MailingService } from "./mailing.service";
export declare class MailingController {
    private mailingService;
    constructor(mailingService: MailingService);
    confirmEmail(id: string): Promise<string>;
}
