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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencySchema = exports.Currency = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Currency = class Currency {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: "comment" }] }),
    __metadata("design:type", Array)
], Currency.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Currency.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Currency.prototype, "dislikes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: "news" }], select: false }),
    __metadata("design:type", Array)
], Currency.prototype, "news", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Currency.prototype, "Symbol", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Currency.prototype, "AssetType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "CIK", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Exchange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Sector", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Industry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "Address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "FiscalYearEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "LatestQuarter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "MarketCapitalization", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "ExchangeRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Currency.prototype, "IpoDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "Volume24h", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "boomRatio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "newsBoomRatio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Currency.prototype, "priority", void 0);
Currency = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Currency);
exports.Currency = Currency;
exports.CurrencySchema = mongoose_1.SchemaFactory.createForClass(Currency);
//# sourceMappingURL=currency.schema.js.map