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
exports.AlphavantageController = void 0;
const common_1 = require("@nestjs/common");
const alphavantage_service_1 = require("./alphavantage.service");
const passport_1 = require("@nestjs/passport");
const GetRecommendation_dto_1 = require("./dto/GetRecommendation.dto");
const GetAssetData_dto_1 = require("./dto/GetAssetData.dto");
const ReactToAsset_dto_1 = require("./dto/ReactToAsset.dto");
const Admin_guard_1 = require("../auth/guards/Admin.guard");
const class_validator_1 = require("class-validator");
class SetPriorityDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetPriorityDto.prototype, "assetId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SetPriorityDto.prototype, "priority", void 0);
class AssetIdDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssetIdDto.prototype, "assetId", void 0);
class FindAssetDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], FindAssetDto.prototype, "assets", void 0);
let AlphavantageController = class AlphavantageController {
    constructor(aplhavantageService) {
        this.aplhavantageService = aplhavantageService;
    }
    getRecommendation(req, dto) {
        return this.aplhavantageService.getRecommendation(req.user.sub, dto?.filters, dto.amount, dto?.forIgnore, dto?.type);
    }
    async getAssetData(req, dto) {
        const assets = await this.aplhavantageService.getAssetsById(dto.assets);
        return this.aplhavantageService.getAssetData(assets, dto?.interval);
    }
    async reactToAsset(req, dto) {
        return this.aplhavantageService.reactToAsset(dto, req.user.sub);
    }
    async removeReaction(req, assetId) {
        return this.aplhavantageService.removeReaction(assetId, req.user.sub);
    }
    async trendingNow(dto) {
        return this.aplhavantageService.getTrendingNow(dto.amount, dto.forIgnore ? dto.forIgnore : [], dto?.filters);
    }
    async setPriority(dto) {
        return this.aplhavantageService.setAssetPriority(dto.assetId, dto.priority);
    }
    async watchlist(req, dto) {
        return this.aplhavantageService.getWatchlist(req.user.sub, dto.amount, dto.forIgnore ? dto.forIgnore : [], dto?.filters);
    }
    async favourites(req, dto) {
        return this.aplhavantageService.getFavourites(req.user.sub, dto.amount, dto.forIgnore ? dto.forIgnore : [], dto?.filters);
    }
    async getAssetsById(dto) {
        return this.aplhavantageService.getAssetsByIds(dto.assets, [], dto.assets.length, {});
    }
    async addToFavourites(req, dto) {
        return this.aplhavantageService.addAssetToFavourites(req.user.sub, dto.assetId);
    }
    async removeFavourite(req, dto) {
        return this.aplhavantageService.removeFavourite(req.user.sub, dto.assetId);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('getRecommendation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetRecommendation_dto_1.GetRecommendationDto]),
    __metadata("design:returntype", void 0)
], AlphavantageController.prototype, "getRecommendation", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('getAssetData'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetAssetData_dto_1.GetAssetDataDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "getAssetData", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('reactToAsset'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ReactToAsset_dto_1.ReactToAssetDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "reactToAsset", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('removeReaction'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "removeReaction", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('trendingNow'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetRecommendation_dto_1.GetRecommendationDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "trendingNow", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), Admin_guard_1.AdminGuard),
    (0, common_1.Post)('setPriority'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetPriorityDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "setPriority", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('watchlist'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetRecommendation_dto_1.GetRecommendationDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "watchlist", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('favourites'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetRecommendation_dto_1.GetRecommendationDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "favourites", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('getAssetsById'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindAssetDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "getAssetsById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('addFavourite'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AssetIdDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "addToFavourites", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('removeFavourite'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AssetIdDto]),
    __metadata("design:returntype", Promise)
], AlphavantageController.prototype, "removeFavourite", null);
AlphavantageController = __decorate([
    (0, common_1.Controller)('alphavantage'),
    __metadata("design:paramtypes", [alphavantage_service_1.AlphavantageService])
], AlphavantageController);
exports.AlphavantageController = AlphavantageController;
//# sourceMappingURL=alphavantage.controller.js.map