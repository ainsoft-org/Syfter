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
exports.NewsSchema = exports.News = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const currency_schema_1 = require("../alphavantage/currency.schema");
let Topic = class Topic {
};
__decorate([
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Topic.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)(Number),
    __metadata("design:type", Number)
], Topic.prototype, "relevance_score", void 0);
Topic = __decorate([
    (0, mongoose_1.Schema)()
], Topic);
const TopicSchema = mongoose_1.SchemaFactory.createForClass(Topic);
let Sentiment = class Sentiment {
};
__decorate([
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Sentiment.prototype, "ticker", void 0);
__decorate([
    (0, mongoose_1.Prop)(Number),
    __metadata("design:type", Number)
], Sentiment.prototype, "relevance_score", void 0);
__decorate([
    (0, mongoose_1.Prop)(Number),
    __metadata("design:type", Number)
], Sentiment.prototype, "sentiment_score", void 0);
__decorate([
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], Sentiment.prototype, "sentiment_label", void 0);
Sentiment = __decorate([
    (0, mongoose_1.Schema)()
], Sentiment);
const SentimentSchema = mongoose_1.SchemaFactory.createForClass(Sentiment);
let News = class News {
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], News.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], News.prototype, "dislikes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], News.prototype, "coeffLike", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], News.prototype, "timePrevLike", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], News.prototype, "AssetType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], News.prototype, "time_published", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], News.prototype, "authors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "banner_image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "category_within_source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "source_domain", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], News.prototype, "sentiment_score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "sentiment_label", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], News.prototype, "newsId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: TopicSchema }] }),
    __metadata("design:type", Topic)
], News.prototype, "topics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SentimentSchema] }),
    __metadata("design:type", Array)
], News.prototype, "sentiments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'currency' }),
    __metadata("design:type", currency_schema_1.Currency)
], News.prototype, "currency", void 0);
News = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], News);
exports.News = News;
exports.NewsSchema = mongoose_1.SchemaFactory.createForClass(News);
//# sourceMappingURL=news.schema.js.map