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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../user/user.schema");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const countries_1 = require("./countries");
const registeringUser_schema_1 = require("./registeringUser.schema");
const address_schema_1 = require("../addresses/address.schema");
const phoneNumber_provider_1 = require("./providers/phoneNumber.provider");
const randomNumberCode_1 = require("./providers/randomNumberCode");
const sendSMS_provider_1 = require("../mailing/sendSMS.provider");
const jwt_1 = require("@nestjs/jwt");
const session_schema_1 = require("../sessions/session.schema");
const authingUser_schema_1 = require("./authingUser.schema");
const mailing_service_1 = require("../mailing/mailing.service");
const alphavantage_service_1 = require("../alphavantage/alphavantage.service");
let AuthService = class AuthService {
    constructor(regingUserModel, userModel, addressModel, sessionModel, authingUserModel, jwtService, mailingService, alphaVantageService, cacheManager) {
        this.regingUserModel = regingUserModel;
        this.userModel = userModel;
        this.addressModel = addressModel;
        this.sessionModel = sessionModel;
        this.authingUserModel = authingUserModel;
        this.jwtService = jwtService;
        this.mailingService = mailingService;
        this.alphaVantageService = alphaVantageService;
        this.cacheManager = cacheManager;
        const clearRegisteringUsersEvery = Number(process.env.clearRegisteringUsersEvery);
        const regTestUsers = async () => {
            for (let i = 0; i < 100; i++) {
                let numberIterator = i.toString();
                if (numberIterator.length === 1)
                    numberIterator = "0" + numberIterator;
                let data;
                try {
                    const data0 = await this.sendRegConfirmationCode({ number: `+3809896968${numberIterator}` });
                    data = data0.data;
                }
                catch (err) {
                    console.log(err);
                    continue;
                }
                const data2 = await this.checkRegConfirmationCode({ regToken: data.regToken, code: data.verificationCode });
                const data3 = await this.setPinReg({ regToken: data.regToken, pin: numberIterator });
                const data4 = await this.setUsernameReg({ regToken: data.regToken, username: "user" + numberIterator });
                const data5 = await this.setEmailReg({ regToken: data.regToken, email: `user${numberIterator}@gmail.com`, acceptNotifications: true });
                const data6 = await this.setAddressReg({
                    regToken: data.regToken,
                    address: "0xB7F24dAc40DFaBd7e89EDc07F49BfeCE6E5bAFa8",
                    device: "iPhone Turbo GT 600-" + numberIterator,
                    country: "Ukraine",
                    deviceID: "deviceID-" + numberIterator
                });
                const user = await this.userModel.findOne({ mobileNumber: `+380 98 969 68${numberIterator}` });
                console.log(user);
                const userId = user._id.toString();
                for (let j = 0; j < 100; j++) {
                    const recommendations = await this.alphaVantageService.getRecommendation(userId, {}, 1);
                    for (let f = 0; f < recommendations.assets; f++) {
                        const reactToAsset = await this.alphaVantageService.reactToAsset({ assetId: recommendations.assets[f]._id.toString(), reaction: Math.random() > 0.5 }, userId);
                    }
                }
            }
        };
    }
    getCountries() {
        return countries_1.countries;
    }
    async getTokens(params) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(params, {
                secret: process.env.access_secret,
                expiresIn: Number(process.env.access_expires)
            }),
            this.jwtService.signAsync(params, {
                secret: process.env.refresh_secret,
                expiresIn: Number(process.env.refresh_expires)
            })
        ]);
        return {
            refresh_token: rt,
            access_token: at
        };
    }
    async generateAt(params) {
        return await this.jwtService.signAsync(params, {
            secret: process.env.access_secret,
            expiresIn: Number(process.env.access_expires)
        });
    }
    async signinLocal(dto) {
        const foundAuthingUser = await this.authingUserModel.findOne({ authToken: dto.authToken });
        if (!foundAuthingUser) {
            throw new common_1.HttpException('Authing user not found by this authToken', common_1.HttpStatus.NOT_FOUND);
        }
        const foundUser = await this.userModel.findOne({ mobileNumber: foundAuthingUser.mobileNumber })
            .select("+pin +sessions");
        if (dto.pin !== foundUser.pin) {
            throw new common_1.HttpException('PIN is not correct', common_1.HttpStatus.FORBIDDEN);
        }
        try {
            const newSession = new this.sessionModel({
                device: dto.device,
                country: dto.country,
                deviceID: dto.deviceID,
                user: foundUser
            });
            const tokens = await this.getTokens({
                roles: foundUser.roles,
                sub: foundUser._id,
                sessionId: newSession._id.toString()
            });
            newSession.refreshToken = tokens.refresh_token;
            foundUser.sessions.push(newSession);
            await newSession.save();
            await foundUser.save();
            await foundAuthingUser.remove();
            return tokens;
        }
        catch (err) {
            throw new common_1.HttpException(`Error: ${err}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout(userId, refreshToken) {
        const foundUser = await this.userModel.findById(userId).select("+sessions");
        if (!foundUser) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const foundSession = await this.sessionModel.findOne({
            refreshToken: refreshToken,
            user: userId
        });
        if (!foundSession) {
            throw new common_1.HttpException('Session not found', common_1.HttpStatus.NOT_FOUND);
        }
        const sessionIndex = foundUser.sessions.findIndex(sessionId => sessionId.toString() === foundSession._id.toString());
        if (sessionIndex === -1) {
            throw new common_1.HttpException('Session not found in user`s sessions array', common_1.HttpStatus.BAD_REQUEST);
        }
        foundUser.sessions.splice(sessionIndex, 1);
        await foundUser.save();
        await foundSession.remove();
        return foundSession;
    }
    async refreshToken(refreshToken) {
        const foundSession = await this.sessionModel.findOne({ refreshToken });
        if (!foundSession)
            throw new common_1.HttpException('Session not found', common_1.HttpStatus.NOT_FOUND);
        const data = this.jwtService.decode(refreshToken);
        if (new Date().getTime() >= data.exp * 1000) {
            throw new common_1.HttpException('RefreshToken is expired', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundUser = await this.userModel.findById(foundSession.user);
        if (!foundUser)
            throw new common_1.HttpException('User of this session not found', common_1.HttpStatus.NOT_FOUND);
        const newAccessToken = await this.generateAt({
            roles: foundUser.roles,
            sub: foundUser._id,
            sessionId: foundSession._id.toString()
        });
        return { access_token: newAccessToken };
    }
    async sendAuthConfirmationCode(mobileNumber) {
        const formattedPhone = (0, phoneNumber_provider_1.parsePhone)(mobileNumber.number).formatInternational();
        const foundUserByPhoneNumber = await this.userModel.findOne({ mobileNumber: formattedPhone });
        if (!foundUserByPhoneNumber) {
            throw new common_1.HttpException('This phone number is not registered', common_1.HttpStatus.FORBIDDEN);
        }
        const foundAuthingUser = await this.authingUserModel.findOne({ mobileNumber: formattedPhone });
        if (!foundAuthingUser) {
            const confirmationCode = (0, randomNumberCode_1.randomNumberCode)(5);
            const authToken = (0, uuid_1.v4)();
            try {
                const newAuthingUser = new this.authingUserModel({
                    verificationCode: confirmationCode,
                    mobileNumber: formattedPhone,
                    authToken
                });
                await newAuthingUser.save();
                await (0, sendSMS_provider_1.sendSMS)("", "", "");
                const newAuthingUserObject = newAuthingUser.toObject();
                return {
                    message: `Confirmation code sent to number: ${formattedPhone}`,
                    data: newAuthingUserObject
                };
            }
            catch (err) {
                throw new common_1.HttpException('Error saving new registering user', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (foundAuthingUser.sentConfirmations >= 3) {
            throw new common_1.HttpException('Too many attempts. Please try again in a hour', common_1.HttpStatus.FORBIDDEN);
        }
        const confirmationCode = (0, randomNumberCode_1.randomNumberCode)(5);
        foundAuthingUser.verificationCode = confirmationCode;
        foundAuthingUser.sentConfirmations++;
        foundAuthingUser.prevCodeTime = new Date();
        await foundAuthingUser.save();
        await (0, sendSMS_provider_1.sendSMS)("", "", "");
        const foundAuthingUserObject = foundAuthingUser.toObject();
        return {
            message: `Confirmation code resent to number: ${formattedPhone}`,
            data: foundAuthingUserObject
        };
    }
    async sendRegConfirmationCode(mobileNumber, flag = false) {
        const conf_code = await this.cacheManager.get("conf_code");
        if (conf_code && !flag) {
            return conf_code;
        }
        const formattedPhone = (0, phoneNumber_provider_1.parsePhone)(mobileNumber.number).formatInternational();
        const foundUserByPhoneNumber = await this.userModel.findOne({ mobileNumber: formattedPhone });
        if (foundUserByPhoneNumber) {
            throw new common_1.HttpException('This phone number already registered', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundRegingUser = await this.regingUserModel.findOne({ mobileNumber: formattedPhone });
        if (!foundRegingUser) {
            const confirmationCode = (0, randomNumberCode_1.randomNumberCode)(5);
            const regToken = (0, uuid_1.v4)();
            try {
                const newRegingUser = new this.regingUserModel({
                    verificationCode: confirmationCode,
                    mobileNumber: formattedPhone,
                    regToken
                });
                await newRegingUser.save();
                await (0, sendSMS_provider_1.sendSMS)("", "", "");
                const newRegingUserObject = newRegingUser.toObject();
                return {
                    message: `Confirmation code sent to number: ${formattedPhone}`,
                    data: newRegingUserObject
                };
            }
            catch (err) {
                console.log(err);
                throw new common_1.HttpException('Error saving new registering user', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (foundRegingUser.sentConfirmations >= 3) {
            throw new common_1.HttpException('Too many attempts. Please try again in a hour', common_1.HttpStatus.FORBIDDEN);
        }
        const confirmationCode = (0, randomNumberCode_1.randomNumberCode)(5);
        foundRegingUser.verificationCode = confirmationCode;
        foundRegingUser.sentConfirmations++;
        foundRegingUser.prevCodeTime = new Date();
        await foundRegingUser.save();
        await (0, sendSMS_provider_1.sendSMS)("", "", "");
        const foundRegingUserObject = foundRegingUser.toObject();
        await this.cacheManager.set("conf_code", {
            message: `Confirmation code resent to number: ${formattedPhone}`,
            data: foundRegingUserObject
        }, 3600000000);
        return {
            message: `Confirmation code resent to number: ${formattedPhone}`,
            data: foundRegingUserObject
        };
    }
    async checkRegConfirmationCode(dto, flag = false) {
        const check_conf_code = await this.cacheManager.get("check_conf_code");
        if (check_conf_code && !flag) {
            return check_conf_code;
        }
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken }).select('+verificationCode');
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "SMS") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        if (dto.code !== foundRegingUser.verificationCode) {
            throw new common_1.HttpException('Entered code is incorrect', common_1.HttpStatus.BAD_REQUEST);
        }
        foundRegingUser.stage = "PIN";
        await foundRegingUser.save();
        const foundRegingUserObj = foundRegingUser.toObject();
        await this.cacheManager.set("check_conf_code", foundRegingUserObj, 3600000000);
        return foundRegingUserObj;
    }
    async setPinReg(dto, flag = false) {
        const pin_reg = await this.cacheManager.get("pin_reg");
        if (pin_reg && !flag) {
            return pin_reg;
        }
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken });
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "PIN") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        foundRegingUser.pin = dto.pin;
        foundRegingUser.stage = "USERNAME";
        await this.cacheManager.set("pin_reg", await foundRegingUser.save(), 3600000000);
        return await foundRegingUser.save();
    }
    async setUsernameReg(dto, flag = false) {
        const username_reg = await this.cacheManager.get("username_reg");
        if (username_reg && !flag) {
            return username_reg;
        }
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken });
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "USERNAME") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        foundRegingUser.username = dto.username;
        foundRegingUser.stage = "EMAIL";
        await this.cacheManager.set("username_reg", await foundRegingUser.save(), 3600000000);
        return await foundRegingUser.save();
    }
    async setEmailReg(dto, flag = false) {
        const email_reg = await this.cacheManager.get("email_reg");
        if (email_reg && !flag) {
            return email_reg;
        }
        const foundByEmail = await this.userModel.findOne({ email: dto.email, emailConfirmed: true });
        if (foundByEmail) {
            throw new common_1.HttpException('This email is already taken', common_1.HttpStatus.BAD_REQUEST);
        }
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken });
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "EMAIL") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        foundRegingUser.email = dto.email;
        foundRegingUser.acceptNotifications = dto.acceptNotifications;
        foundRegingUser.stage = "ADDRESS";
        await this.cacheManager.set("username_reg", await foundRegingUser.save(), 3600000000);
        return await foundRegingUser.save();
    }
    async setAddressReg(dto, flag = false) {
        const address_reg = await this.cacheManager.get("address_reg");
        if (address_reg && !flag) {
            return address_reg;
        }
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken })
            .select("+pin");
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "ADDRESS") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const newAddress = new this.addressModel({
                network: process.env.networkForFreeTokens,
                content: dto.address
            });
            const newUser = new this.userModel({
                mobileNumber: foundRegingUser.mobileNumber,
                pin: foundRegingUser.pin,
                username: foundRegingUser.username,
                email: foundRegingUser.email,
                acceptNotifications: foundRegingUser.acceptNotifications
            });
            const newSession = new this.sessionModel({
                device: dto.device,
                country: dto.country,
                deviceID: dto.deviceID,
                user: newUser
            });
            const tokens = await this.getTokens({
                roles: newUser.roles,
                sub: newUser._id,
                sessionId: newSession._id.toString()
            });
            newSession.refreshToken = tokens.refresh_token;
            try {
                await this.mailingService.generateEmailConfirmation(newUser);
            }
            catch (err) {
                console.log(err);
            }
            newAddress.user = newUser;
            newUser.addresses.push(newAddress);
            newUser.sessions.push(newSession);
            await newUser.save();
            await newAddress.save();
            await newSession.save();
            await foundRegingUser.remove();
            await this.cacheManager.set("username_reg", tokens, 3600000000);
            return tokens;
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ message: "Something went wrong. Please try later" }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(registeringUser_schema_1.RegisteringUser.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(address_schema_1.Address.name)),
    __param(3, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(4, (0, mongoose_1.InjectModel)(authingUser_schema_1.AuthingUser.name)),
    __param(8, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        mailing_service_1.MailingService,
        alphavantage_service_1.AlphavantageService, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map