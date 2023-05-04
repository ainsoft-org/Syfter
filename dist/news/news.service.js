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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const news_schema_1 = require("./news.schema");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../user/user.schema");
let NewsService = class NewsService {
    constructor(newsModel, userModel, cacheManager) {
        this.newsModel = newsModel;
        this.userModel = userModel;
        this.cacheManager = cacheManager;
    }
    async likeNews(userId, newsId) {
        const user = await this.userModel.findById(userId).select("likedNews dislikedNews removedLikedNews");
        const news = await this.newsModel.findById(newsId);
        if (!news)
            throw new common_1.HttpException("News not found", common_1.HttpStatus.NOT_FOUND);
        const likedNewsIndex = user.likedNews.findIndex(liked => liked.toString() === newsId);
        if (likedNewsIndex !== -1) {
            news.likes--;
            user.likedNews.splice(likedNewsIndex, 1);
            await user.save();
            await news.save();
            return { ...news.toObject(), isLiked: false, isDisliked: false, reputation: news.likes - news.dislikes };
        }
        const dislikedNewsIndex = user.dislikedNews.findIndex(disliked => disliked.toString() === newsId);
        if (dislikedNewsIndex !== -1) {
            user.dislikedNews.splice(dislikedNewsIndex);
            news.dislikes--;
        }
        news.likes++;
        const removedLikeIndex = user.removedLikedNews.findIndex(removedLike => removedLike.toString() === newsId);
        if (removedLikeIndex === -1) {
            const newCoeff = 1 / (new Date().getTime() - news.timePrevLike.getTime());
            const averageCoeff = (news.coeffLike * (news.likes - 1) + newCoeff) / news.likes;
            news.coeffLike = averageCoeff;
            news.timePrevLike = new Date();
        }
        user.likedNews.push(news);
        await news.save();
        await user.save();
        return { ...news.toObject(), isLiked: true, isDisliked: false, reputation: news.likes - news.dislikes };
    }
    async dislikeNews(userId, newsId) {
        const user = await this.userModel.findById(userId).select("likedNews dislikedNews removedLikedNews");
        const news = await this.newsModel.findById(newsId);
        if (!news)
            throw new common_1.HttpException("News not found", common_1.HttpStatus.NOT_FOUND);
        const dislikedNewsIndex = user.dislikedNews.findIndex(disliked => disliked.toString() === newsId);
        if (dislikedNewsIndex !== -1) {
            news.dislikes--;
            user.dislikedNews.splice(dislikedNewsIndex, 1);
            await user.save();
            await news.save();
            return { ...news.toObject(), isLiked: false, isDisliked: false, reputation: news.likes - news.dislikes };
        }
        const likedNewsIndex = user.likedNews.findIndex(liked => liked.toString() === newsId);
        if (likedNewsIndex !== -1) {
            user.likedNews.splice(likedNewsIndex);
            user.removedLikedNews.push(news);
            news.likes--;
        }
        news.dislikes++;
        user.dislikedNews.push(news);
        await news.save();
        await user.save();
        return { ...news.toObject(), isLiked: false, isDisliked: true, reputation: news.likes - news.dislikes };
    }
    async getNews(userId, amount, asset = "", filters = {}, forIgnore = []) {
        const user = await this.userModel.findById(userId).select("likedNews dislikedNews");
        const newPeriod = 605000000;
        const matches = {};
        if (filters.period === "new") {
            matches.dateDifference = { $lte: newPeriod };
        }
        else if (filters.period === "old") {
            matches.dateDifference = { $gte: newPeriod };
        }
        if (filters.isCryptocurrency === true) {
            matches.AssetType = "Cryptocurrency";
        }
        else if (filters.isCryptocurrency === false) {
            matches.AssetType = { $ne: "Cryptocurrency" };
        }
        const news = await this.newsModel.aggregate([
            { $match: asset ? { currency: new mongoose_2.default.Types.ObjectId(asset) } : {} },
            { $addFields: {
                    dateDifference: { $dateDiff: {
                            startDate: "$time_published",
                            endDate: new Date(),
                            unit: "millisecond"
                        } },
                    isLiked: { $in: ["$_id", user.likedNews] },
                    isDisliked: { $in: ["$_id", user.dislikedNews] },
                    reputation: { $subtract: ["$likes", "$dislikes"] }
                } },
            { $match: {
                    _id: {
                        $nin: forIgnore.map(id => new mongoose_2.default.Types.ObjectId(id))
                    },
                    ...matches
                } },
            { $sort: {
                    coeffLike: -1
                } },
            { $limit: amount },
        ]);
        return { news: news };
    }
};
NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(news_schema_1.News.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object])
], NewsService);
exports.NewsService = NewsService;
//# sourceMappingURL=news.service.js.map