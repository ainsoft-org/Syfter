"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailingService = void 0;
const common_1 = require("@nestjs/common");
const client_ses_1 = require("@aws-sdk/client-ses");
const mongoose_1 = require("@nestjs/mongoose");
const EmailConfirmation_schema_1 = require("./EmailConfirmation.schema");
const user_schema_1 = require("../user/user.schema");
const mongoose_2 = require("mongoose");
const EmailConfirmation_command_1 = require("./EmailCommands/EmailConfirmation.command");
const clearEmailConfirmations_1 = require("./providers/clearEmailConfirmations");
let MailingService = class MailingService {
    constructor(userModel, emailConfirmationModel) {
        this.userModel = userModel;
        this.emailConfirmationModel = emailConfirmationModel;
        this.client = new client_ses_1.SESClient({ region: "eu-central-1" });
        const clearEmailConfirmationsEvery = Number(process.env.clearEmailConfirmationsEvery);
        setInterval(async () => {
            if (await (0, clearEmailConfirmations_1.clearEmailConfirmations)(emailConfirmationModel)) {
                console.log(`--cleared email confirmations after specified time (.env)--${new Date()}`);
            }
        }, clearEmailConfirmationsEvery);
    }
    async generateEmailConfirmation(user) {
        try {
            const newEmailConfirmation = new this.emailConfirmationModel({ user });
            const sendEmailCommand = (0, EmailConfirmation_command_1.createEmailConfirmationCommand)(user.email, `${process.env.host}/mailing/emailConfirmation/${newEmailConfirmation._id.toString()}`);
            await this.client.send(sendEmailCommand);
            await newEmailConfirmation.save();
        }
        catch (err) {
            throw new common_1.HttpException('Error sending email confirmation list', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async confirmEmail(emailConfirmationId) {
        try {
            const foundEmailConfirmation = await this.emailConfirmationModel.findById(emailConfirmationId);
            if (!foundEmailConfirmation)
                throw new common_1.HttpException("Link doesn't currently", common_1.HttpStatus.BAD_REQUEST);
            const user = await this.userModel.findById(foundEmailConfirmation.user);
            if (!user)
                throw new common_1.HttpException("User not found for this link", common_1.HttpStatus.BAD_REQUEST);
            user.emailConfirmed = true;
            await user.save();
            await foundEmailConfirmation.remove();
        }
        catch (err) {
            throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.BAD_REQUEST);
        }
        return "Confirmed";
    }
};
MailingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(EmailConfirmation_schema_1.EmailConfirmation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MailingService);
exports.MailingService = MailingService;
//# sourceMappingURL=mailing.service.js.map