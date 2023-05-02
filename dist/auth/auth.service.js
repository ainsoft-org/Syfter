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
const clearRegisteringUsers_provider_1 = require("./providers/clearRegisteringUsers.provider");
const phoneNumber_provider_1 = require("./providers/phoneNumber.provider");
const randomNumberCode_1 = require("./providers/randomNumberCode");
const jwt_1 = require("@nestjs/jwt");
const session_schema_1 = require("../sessions/session.schema");
const authingUser_schema_1 = require("./authingUser.schema");
const clearAuthingUsers_provider_1 = require("./providers/clearAuthingUsers.provider");
const mailing_service_1 = require("../mailing/mailing.service");
const alphavantage_service_1 = require("../alphavantage/alphavantage.service");
const geoip_lite_1 = require("geoip-lite");
const restoringPinUser_schema_1 = require("./restoringPinUser.schema");
const clearRestoringPinUsers_provider_1 = require("./providers/clearRestoringPinUsers.provider");
let AuthService = class AuthService {
    constructor(regingUserModel, userModel, addressModel, sessionModel, authingUserModel, jwtService, mailingService, alphaVantageService, RestoringPinUserModel) {
        this.regingUserModel = regingUserModel;
        this.userModel = userModel;
        this.addressModel = addressModel;
        this.sessionModel = sessionModel;
        this.authingUserModel = authingUserModel;
        this.jwtService = jwtService;
        this.mailingService = mailingService;
        this.alphaVantageService = alphaVantageService;
        this.RestoringPinUserModel = RestoringPinUserModel;
        const clearRegisteringUsersEvery = Number(process.env.clearRegisteringUsersEvery);
        setInterval(async () => {
            if (await (0, clearRegisteringUsers_provider_1.clearRegisteringUsers)(regingUserModel)) {
                console.log(`--cleared some actively registering users after specified time --${new Date()}`);
            }
            if (await (0, clearAuthingUsers_provider_1.clearAuthingUsers)(authingUserModel)) {
                console.log(`--cleared some actively authing users after specified time --${new Date()}`);
            }
            if (await (0, clearRestoringPinUsers_provider_1.clearRestoringPinUsers)(RestoringPinUserModel)) {
                console.log(`--cleared some actively restoring pin users after specified time --${new Date()}`);
            }
        }, clearRegisteringUsersEvery);
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
    getCountry(ip) {
        const country = (0, geoip_lite_1.lookup)(ip)?.country;
        return country || "unknown";
    }
    async signinTwitter(dto) {
        const user = await this.userModel.findOne({ twitterId: dto.twitterID });
        if (user) {
            if (dto.image)
                user.image = dto.image;
            await user.save();
            return { data: await this.sendAuthConfirmationCode("", dto.twitterID), status: "auth" };
        }
        const regToken = (0, uuid_1.v4)();
        const payload = {
            twitterId: dto.twitterID,
            regToken,
            stage: "PIN"
        };
        if (dto.image) {
            payload.image = dto.image;
        }
        else {
            payload.image = process.env.host + "/uploads/default_image.png";
        }
        const newRegisteringUser = new this.regingUserModel(payload);
        await newRegisteringUser.save();
        return {
            status: "reg",
            data: {
                regToken: newRegisteringUser.regToken
            }
        };
    }
    async signinLocal(dto, ip) {
        const foundAuthingUser = await this.authingUserModel.findOne({ authToken: dto.authToken });
        if (!foundAuthingUser) {
            throw new common_1.HttpException('Authing user not found by this authToken', common_1.HttpStatus.NOT_FOUND);
        }
        const foundUser = await this.userModel.findById(foundAuthingUser.userID)
            .select("+pin +sessions +email");
        if (dto.pin !== foundUser.pin) {
            throw new common_1.HttpException('PIN is not correct', common_1.HttpStatus.FORBIDDEN);
        }
        const foundSession = await this.sessionModel.findOne({ deviceID: dto.deviceID });
        if (foundSession) {
            const foundSessionUser = await this.userModel.findById(foundSession.user).select("+sessions");
            if (foundSessionUser) {
                const sessionIndex = foundSessionUser.sessions.findIndex(sessionsId => sessionsId.toString() === foundSession._id.toString());
                if (sessionIndex !== -1) {
                    foundSessionUser.sessions.splice(sessionIndex, 1);
                    await foundSessionUser.save();
                }
            }
            await foundSession.remove();
        }
        try {
            const newSession = new this.sessionModel({
                device: dto.device,
                country: this.getCountry(ip),
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
            return { ...tokens, username: foundUser.username, email: foundUser.email, image: foundUser.image || process.env.host + "/uploads/default_image.png" };
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
            throw new common_1.HttpException("Your session is closed", common_1.HttpStatus.UNAUTHORIZED);
        const foundUser = await this.userModel.findById(foundSession.user).select("+sessions");
        let data;
        try {
            data = await this.jwtService.verifyAsync(refreshToken, { publicKey: process.env.refresh_secret });
        }
        catch (err) {
            const sessionIndex = foundUser.sessions.findIndex(sessionsId => sessionsId.toString() === foundSession._id.toString());
            if (sessionIndex !== -1) {
                foundUser.sessions.splice(sessionIndex, 1);
                await foundUser.save();
            }
            await foundSession.remove();
            throw new common_1.HttpException("Invalid refresh token", common_1.HttpStatus.UNAUTHORIZED);
        }
        const newAccessToken = await this.generateAt({
            roles: foundUser.roles,
            sub: foundUser._id,
            sessionId: foundSession._id.toString()
        });
        return { access_token: newAccessToken };
    }
    async restorePin(mobileNumber) {
        let formattedPhone;
        try {
            formattedPhone = (0, phoneNumber_provider_1.parsePhone)(mobileNumber).formatInternational();
        }
        catch (err) { }
        let foundUser;
        if (formattedPhone) {
            foundUser = await this.userModel.findOne({ mobileNumber: formattedPhone }).select("_id");
        }
        if (!foundUser) {
            throw new common_1.HttpException('Account is not registered', common_1.HttpStatus.FORBIDDEN);
        }
        let foundRestoringPinUser = await this.RestoringPinUserModel.findOne({ userID: foundUser._id.toString() });
        if (!foundRestoringPinUser) {
            const confirmationCode = (0, randomNumberCode_1.randomNumberCode)(5);
            foundRestoringPinUser = new this.RestoringPinUserModel({
                userID: foundUser._id.toString(),
                verificationCode: confirmationCode,
                restoreToken: (0, uuid_1.v4)()
            });
            await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);
            await foundRestoringPinUser.save();
            const foundRestoringPinUserObject = foundRestoringPinUser.toObject();
            delete foundRestoringPinUserObject.verificationCode;
            return foundRestoringPinUserObject;
        }
        if (foundRestoringPinUser.sentConfirmations >= 3) {
            throw new common_1.HttpException('Too many attempts. Please try again in a hour', common_1.HttpStatus.FORBIDDEN);
        }
        const confirmationCode = (0, randomNumberCode_1.randomNumberCode)(5);
        foundRestoringPinUser.verificationCode = confirmationCode;
        foundRestoringPinUser.sentConfirmations++;
        foundRestoringPinUser.prevCodeTime = new Date();
        await foundRestoringPinUser.save();
        await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);
        const foundRestoringPinUserObject = foundRestoringPinUser.toObject();
        delete foundRestoringPinUserObject.verificationCode;
        return foundRestoringPinUserObject;
    }
    async confirmRestorePin(restoreToken, code) {
        const foundRestoringPinUser = await this.RestoringPinUserModel.findOne({ restoreToken }).select("+verificationCode");
        if (!foundRestoringPinUser) {
            throw new common_1.HttpException("Restoring pin session is not found. Try again", common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRestoringPinUser.verificationCode !== code) {
            throw new common_1.HttpException("Incorrect confirmation code", common_1.HttpStatus.BAD_REQUEST);
        }
        foundRestoringPinUser.confirmed = true;
        await foundRestoringPinUser.save();
        return foundRestoringPinUser;
    }
    async restorePin2(dto) {
        const foundRestoringPinUser = await this.RestoringPinUserModel.findOne({ restoreToken: dto.restoreToken });
        if (!foundRestoringPinUser) {
            throw new common_1.HttpException("Restoring pin session is not found. Try again", common_1.HttpStatus.NOT_FOUND);
        }
        if (!foundRestoringPinUser.confirmed) {
            throw new common_1.HttpException("PIN restore request has not yet been confirmed", common_1.HttpStatus.NOT_FOUND);
        }
        const user = await this.userModel.findById(foundRestoringPinUser.userID);
        user.pin = dto.pin;
        await user.save();
        await foundRestoringPinUser.remove();
        return { message: "PIN restored" };
    }
    async sendAuthConfirmationCode(mobileNumber, twitterId = "") {
        let formattedPhone = null;
        try {
            formattedPhone = (0, phoneNumber_provider_1.parsePhone)(mobileNumber).formatInternational();
        }
        catch (err) { }
        let foundUser;
        if (formattedPhone) {
            foundUser = await this.userModel.findOne({ mobileNumber: formattedPhone }).select("_id");
        }
        else if (twitterId) {
            foundUser = await this.userModel.findOne({ twitterId }).select("_id");
        }
        if (!foundUser) {
            throw new common_1.HttpException('Account is not registered', common_1.HttpStatus.FORBIDDEN);
        }
        const foundAuthingUser = await this.authingUserModel.findOne({ userID: foundUser._id });
        if (!foundAuthingUser) {
            const authToken = (0, uuid_1.v4)();
            try {
                const newAuthingUser = new this.authingUserModel({
                    userID: foundUser._id,
                    authToken
                });
                await newAuthingUser.save();
                return {
                    message: `Authing process started`,
                    authToken
                };
            }
            catch (err) {
                console.log(err);
                throw new common_1.HttpException('Error saving new authing user', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return {
            message: `Authing process is still active`,
            authToken: foundAuthingUser.authToken
        };
    }
    async sendRegConfirmationCode(mobileNumber) {
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
                await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);
                const newRegingUserObject = newRegingUser.toObject();
                delete newRegingUserObject.verificationCode;
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
        await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);
        const foundRegingUserObject = foundRegingUser.toObject();
        delete foundRegingUserObject.verificationCode;
        return {
            message: `Confirmation code resent to number: ${formattedPhone}`,
            data: foundRegingUserObject
        };
    }
    async checkRegConfirmationCode(dto) {
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
        delete foundRegingUserObj.verificationCode;
        return foundRegingUserObj;
    }
    async setPinReg(dto) {
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken });
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "PIN") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        foundRegingUser.pin = dto.pin;
        foundRegingUser.stage = "USERNAME";
        return await foundRegingUser.save();
    }
    async setUsernameReg(dto) {
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken });
        if (!foundRegingUser) {
            throw new common_1.HttpException('Reging user not found by this regToken', common_1.HttpStatus.NOT_FOUND);
        }
        if (foundRegingUser.stage !== "USERNAME") {
            throw new common_1.HttpException('Error stage for this endpoint', common_1.HttpStatus.BAD_REQUEST);
        }
        foundRegingUser.username = dto.username;
        foundRegingUser.stage = "EMAIL";
        return await foundRegingUser.save();
    }
    async setEmailReg(dto) {
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
        return await foundRegingUser.save();
    }
    async setAddressReg(dto, ip) {
        const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken })
            .select("+pin +mobileNumber +username +email +acceptNotifications");
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
            const payload = {
                mobileNumber: foundRegingUser.mobileNumber,
                pin: foundRegingUser.pin,
                username: foundRegingUser.username,
                email: foundRegingUser.email,
                acceptNotifications: foundRegingUser.acceptNotifications,
                twitterId: foundRegingUser.twitterId
            };
            payload.image = foundRegingUser.image || process.env.host + "/uploads/default_image.png";
            const newUser = new this.userModel(payload);
            const foundSession = await this.sessionModel.findOne({ deviceID: dto.deviceID });
            if (foundSession) {
                const foundSessionUser = await this.userModel.findById(foundSession.user).select("+sessions");
                if (foundSessionUser) {
                    const sessionIndex = foundSessionUser.sessions.findIndex(sessionsId => sessionsId.toString() === foundSession._id.toString());
                    if (sessionIndex !== -1) {
                        foundSessionUser.sessions.splice(sessionIndex, 1);
                        await foundSessionUser.save();
                    }
                }
                await foundSession.remove();
            }
            const newSession = new this.sessionModel({
                device: dto.device,
                country: this.getCountry(ip),
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
                await this.mailingService.generateEmailConfirmation(newUser._id.toString());
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
            return { ...tokens, username: newUser.username, email: newUser.email, image: newUser.image };
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
    __param(8, (0, mongoose_1.InjectModel)(restoringPinUser_schema_1.RestoringPinUser.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        mailing_service_1.MailingService,
        alphavantage_service_1.AlphavantageService,
        mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map