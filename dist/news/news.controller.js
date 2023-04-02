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
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const news_service_1 = require("./news.service");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class newsIdDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], newsIdDto.prototype, "newsId", void 0);
var periodEnum;
(function (periodEnum) {
    periodEnum["old"] = "old";
    periodEnum["new"] = "new";
})(periodEnum || (periodEnum = {}));
class FiltersDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiltersDto.prototype, "isCryptocurrency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(periodEnum),
    __metadata("design:type", String)
], FiltersDto.prototype, "period", void 0);
class GetNewsDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetNewsDto.prototype, "forIgnore", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GetNewsDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => FiltersDto),
    __metadata("design:type", FiltersDto)
], GetNewsDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetNewsDto.prototype, "asset", void 0);
let NewsController = class NewsController {
    constructor(newsService) {
        this.newsService = newsService;
    }
    async topNews(req, dto) {
        return this.newsService.getNews(req.user.sub, dto.amount, dto?.asset || "", dto?.filters || {}, dto.forIgnore || []);
    }
    async likeNews(req, dto) {
        return this.newsService.likeNews(req.user.sub, dto.newsId);
    }
    async dislikeNews(req, dto) {
        return this.newsService.dislikeNews(req.user.sub, dto.newsId);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('topNews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetNewsDto]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "topNews", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('likeNews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, newsIdDto]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "likeNews", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('dislikeNews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, newsIdDto]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "dislikeNews", null);
NewsController = __decorate([
    (0, common_1.Controller)('news'),
    __metadata("design:paramtypes", [news_service_1.NewsService])
], NewsController);
exports.NewsController = NewsController;
//# sourceMappingURL=news.controller.js.map