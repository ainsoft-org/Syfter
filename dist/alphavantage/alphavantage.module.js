"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlphavantageModule = void 0;
const common_1 = require("@nestjs/common");
const alphavantage_controller_1 = require("./alphavantage.controller");
const alphavantage_service_1 = require("./alphavantage.service");
const mongoose_1 = require("@nestjs/mongoose");
const currency_schema_1 = require("./currency.schema");
const news_schema_1 = require("../news/news.schema");
const currentStat_schema_1 = require("./currentStat.schema");
const user_schema_1 = require("../user/user.schema");
const cache_1 = require("@nestjs/common/cache");
let AlphavantageModule = class AlphavantageModule {
};
AlphavantageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: currency_schema_1.Currency.name, schema: currency_schema_1.CurrencySchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: news_schema_1.News.name, schema: news_schema_1.NewsSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: currentStat_schema_1.CurrentStat.name, schema: currentStat_schema_1.CurrentStatSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            cache_1.CacheModule.register({
                socket: {
                    host: 'localhost',
                    port: 6379
                }
            }),
        ],
        controllers: [alphavantage_controller_1.AlphavantageController],
        providers: [alphavantage_service_1.AlphavantageService],
        exports: [alphavantage_service_1.AlphavantageService]
    })
], AlphavantageModule);
exports.AlphavantageModule = AlphavantageModule;
//# sourceMappingURL=alphavantage.module.js.map