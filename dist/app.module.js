"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const db_module_1 = require("./db/db.module");
const user_module_1 = require("./user/user.module");
const addresses_module_1 = require("./addresses/addresses.module");
const mailing_module_1 = require("./mailing/mailing.module");
const sessions_module_1 = require("./sessions/sessions.module");
const alphavantage_module_1 = require("./alphavantage/alphavantage.module");
const news_module_1 = require("./news/news.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot("mongodb+srv://syfter:nFrE1TnBgtyJeLmd@cluster0.8fgzrra.mongodb.net/?retryWrites=true&w=majority"),
            auth_module_1.AuthModule,
            db_module_1.DbModule,
            user_module_1.UserModule,
            addresses_module_1.AddressesModule,
            mailing_module_1.MailingModule,
            sessions_module_1.SessionsModule,
            alphavantage_module_1.AlphavantageModule,
            news_module_1.NewsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map