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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const MobileNumber_dto_1 = require("./dto/MobileNumber.dto");
const CheckRegConfirmationCode_dto_1 = require("./dto/Reg/CheckRegConfirmationCode.dto");
const SetPinReg_dto_1 = require("./dto/Reg/SetPinReg.dto");
const SetUsernameRegDto_dto_1 = require("./dto/Reg/SetUsernameRegDto.dto");
const SetEmailReg_dto_1 = require("./dto/Reg/SetEmailReg.dto");
const SetAddressReg_dto_1 = require("./dto/Reg/SetAddressReg.dto");
const SignInLocal_dto_1 = require("./dto/SignInLocal.dto");
const passport_1 = require("@nestjs/passport");
const RefreshToken_dto_1 = require("./dto/RefreshToken.dto");
const TwitterAuth_guard_1 = require("./strategies/TwitterAuth.guard");
const restorePin_dto_1 = require("./dto/restorePin.dto");
const confirmRestorePin_dto_1 = require("./dto/confirmRestorePin.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getCountries() {
        return this.authService.getCountries();
    }
    twitterSignin() {
        console.log("signin");
        return "yes";
    }
    twitterRedirect(req) {
        return req.user;
    }
    restorePin(dto) {
        return this.authService.restorePin(dto.number);
    }
    confirmRestorePin(dto) {
        return this.authService.confirmRestorePin(dto.restoreToken, dto.code);
    }
    restorePin2(dto) {
        return this.authService.restorePin2(dto);
    }
    sendAuthConfirmationCode(dto) {
        return this.authService.sendAuthConfirmationCode(dto.number);
    }
    signinLocal(req, dto) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return this.authService.signinLocal(dto, ip);
    }
    logout(req, dto) {
        return this.authService.logout(req.user.sub, dto.refreshToken);
    }
    refreshToken(dto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
    sendRegConfirmationCode(mobileNumber) {
        return this.authService.sendRegConfirmationCode(mobileNumber);
    }
    checkRegConfirmationCode(dto) {
        return this.authService.checkRegConfirmationCode(dto);
    }
    setPinReg(dto) {
        return this.authService.setPinReg(dto);
    }
    setUsernameReg(dto) {
        return this.authService.setUsernameReg(dto);
    }
    setEmailReg(dto) {
        return this.authService.setEmailReg(dto);
    }
    setAddressReg(req, dto) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return this.authService.setAddressReg(dto, ip);
    }
};
__decorate([
    (0, common_1.Get)('/getCountries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getCountries", null);
__decorate([
    (0, common_1.UseGuards)(TwitterAuth_guard_1.TwitterAuthGuard),
    (0, common_1.Get)('/twitter/signin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "twitterSignin", null);
__decorate([
    (0, common_1.UseGuards)(TwitterAuth_guard_1.TwitterAuthGuard),
    (0, common_1.Get)('/twitter/redirect'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "twitterRedirect", null);
__decorate([
    (0, common_1.Post)('/restorePin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MobileNumber_dto_1.MobileNumberDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "restorePin", null);
__decorate([
    (0, common_1.Post)('/confirmRestorePin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirmRestorePin_dto_1.ConfirmRestorePinDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "confirmRestorePin", null);
__decorate([
    (0, common_1.Post)('/restorePin2'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restorePin_dto_1.RestorePinDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "restorePin2", null);
__decorate([
    (0, common_1.Post)('/checkAccount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MobileNumber_dto_1.MobileNumberDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendAuthConfirmationCode", null);
__decorate([
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SignInLocal_dto_1.SignInLocalDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signinLocal", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RefreshToken_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('/refreshToken'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshToken_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('/sendRegConfirmationCode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MobileNumber_dto_1.MobileNumberDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendRegConfirmationCode", null);
__decorate([
    (0, common_1.Post)('/checkRegConfirmationCode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CheckRegConfirmationCode_dto_1.CheckRegConfirmationCode]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "checkRegConfirmationCode", null);
__decorate([
    (0, common_1.Post)('/setPinReg'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetPinReg_dto_1.SetPinRegDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "setPinReg", null);
__decorate([
    (0, common_1.Post)('/setUsernameReg'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetUsernameRegDto_dto_1.SetUsernameRegDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "setUsernameReg", null);
__decorate([
    (0, common_1.Post)('/setEmailReg'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetEmailReg_dto_1.SetEmailRegDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "setEmailReg", null);
__decorate([
    (0, common_1.Post)('/setAddressReg'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetAddressReg_dto_1.SetAddressRegDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "setAddressReg", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map