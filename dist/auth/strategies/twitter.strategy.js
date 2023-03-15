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
exports.TwitterStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_twitter_1 = require("passport-twitter");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../../user/user.schema");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("../../sessions/session.schema");
const registeringUser_schema_1 = require("../registeringUser.schema");
const uuid_1 = require("uuid");
const auth_service_1 = require("../auth.service");
const process = require("process");
let TwitterStrategy = class TwitterStrategy extends (0, passport_1.PassportStrategy)(passport_twitter_1.Strategy) {
    constructor(regingUserModel, userModel, sessionModel, authService) {
        super({
            consumerKey: process.env.TWITTER_API_KEY,
            consumerSecret: process.env.TWITTER_API_SECRET,
            callbackURL: process.env.oauthRedirect
        });
        this.regingUserModel = regingUserModel;
        this.userModel = userModel;
        this.sessionModel = sessionModel;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile) {
        console.log(profile);
        const twitterId = profile._json.id_str;
        const user = await this.userModel.findOne({ twitterId });
        if (user) {
            return { data: await this.authService.sendAuthConfirmationCode("", twitterId), status: "auth" };
        }
        const regToken = (0, uuid_1.v4)();
        const newRegisteringUser = new this.regingUserModel({
            twitterId,
            regToken,
            stage: "PIN"
        });
        await newRegisteringUser.save();
        return {
            status: "reg",
            data: {
                regToken: newRegisteringUser.regToken
            }
        };
    }
};
TwitterStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(registeringUser_schema_1.RegisteringUser.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        auth_service_1.AuthService])
], TwitterStrategy);
exports.TwitterStrategy = TwitterStrategy;
//# sourceMappingURL=twitter.strategy.js.map