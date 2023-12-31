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
exports.MailingController = void 0;
const common_1 = require("@nestjs/common");
const mailing_service_1 = require("./mailing.service");
let MailingController = class MailingController {
    constructor(mailingService) {
        this.mailingService = mailingService;
    }
    sendEmailConfirmation(id) {
        return this.mailingService.generateEmailConfirmation(id);
    }
    confirmEmail(id) {
        return this.mailingService.confirmEmail(id);
    }
};
__decorate([
    (0, common_1.Post)('/sendEmailConfirmation/*'),
    __param(0, (0, common_1.Param)('0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MailingController.prototype, "sendEmailConfirmation", null);
__decorate([
    (0, common_1.Get)('/emailConfirmation/*'),
    __param(0, (0, common_1.Param)('0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MailingController.prototype, "confirmEmail", null);
MailingController = __decorate([
    (0, common_1.Controller)('mailing'),
    __metadata("design:paramtypes", [mailing_service_1.MailingService])
], MailingController);
exports.MailingController = MailingController;
//# sourceMappingURL=mailing.controller.js.map