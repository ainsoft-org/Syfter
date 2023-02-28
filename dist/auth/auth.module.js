"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../user/user.schema");
const mailing_module_1 = require("../mailing/mailing.module");
const address_schema_1 = require("../addresses/address.schema");
const registeringUser_schema_1 = require("./registeringUser.schema");
const at_strategy_1 = require("./strategies/at.strategy");
const jwt_1 = require("@nestjs/jwt");
const session_schema_1 = require("../sessions/session.schema");
const authingUser_schema_1 = require("./authingUser.schema");
const twitter_strategy_1 = require("./strategies/twitter.strategy");
const alphavantage_module_1 = require("../alphavantage/alphavantage.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: address_schema_1.Address.name, schema: address_schema_1.AddressSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: registeringUser_schema_1.RegisteringUser.name, schema: registeringUser_schema_1.RegisteringUserSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: authingUser_schema_1.AuthingUser.name, schema: authingUser_schema_1.AuthingUserSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema }]),
            mailing_module_1.MailingModule,
            jwt_1.JwtModule.register({}),
            alphavantage_module_1.AlphavantageModule
        ],
        providers: [
            auth_service_1.AuthService,
            at_strategy_1.AtStrategy,
            twitter_strategy_1.TwitterStrategy
        ],
        controllers: [auth_controller_1.AuthController]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map