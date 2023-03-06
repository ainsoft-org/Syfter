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
exports.CommentsController = exports.GetIdeasDto = void 0;
const common_1 = require("@nestjs/common");
const comments_service_1 = require("./comments.service");
const passport_1 = require("@nestjs/passport");
const AddComment_dto_1 = require("./dto/AddComment.dto");
const RemoveComment_dto_1 = require("./dto/RemoveComment.dto");
const LikeComment_dto_1 = require("./dto/LikeComment.dto");
const class_validator_1 = require("class-validator");
var SortByEnum;
(function (SortByEnum) {
    SortByEnum[SortByEnum["date"] = 0] = "date";
    SortByEnum[SortByEnum["reputation"] = 1] = "reputation";
})(SortByEnum || (SortByEnum = {}));
class GetIdeasDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GetIdeasDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(SortByEnum),
    __metadata("design:type", String)
], GetIdeasDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], GetIdeasDto.prototype, "forIgnore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetIdeasDto.prototype, "repliesTo", void 0);
exports.GetIdeasDto = GetIdeasDto;
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    async add(req, dto) {
        return this.commentsService.addComment(req.user.sub, dto.assetId, dto.content, dto.replyTo || "");
    }
    async remove(req, dto) {
        return this.commentsService.removeComment(req.user.sub, dto.commentId);
    }
    async like(req, dto) {
        return this.commentsService.likeComment(req.user.sub, dto.commentId);
    }
    async dislike(req, dto) {
        return this.commentsService.dislikeComment(req.user.sub, dto.commentId);
    }
    async ideas(req, dto) {
        return this.commentsService.getIdeas(dto.amount, dto.sortBy, dto.forIgnore || [], dto.repliesTo || "");
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AddComment_dto_1.AddCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "add", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('remove'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RemoveComment_dto_1.RemoveCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('like'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, LikeComment_dto_1.LikeCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "like", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('dislike'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, LikeComment_dto_1.LikeCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "dislike", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('ideas'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GetIdeasDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "ideas", null);
CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
exports.CommentsController = CommentsController;
//# sourceMappingURL=comments.controller.js.map