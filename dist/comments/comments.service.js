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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../user/user.schema");
const mongoose_2 = require("mongoose");
const comments_schema_1 = require("./comments.schema");
const currency_schema_1 = require("../alphavantage/currency.schema");
let CommentsService = class CommentsService {
    constructor(userModel, commentModel, currencyModel) {
        this.userModel = userModel;
        this.commentModel = commentModel;
        this.currencyModel = currencyModel;
    }
    async addComment(userId, assetId, content, replyTo = "") {
        const author = await this.userModel.findById(userId);
        const asset = await this.currencyModel.findById(assetId);
        if (!asset)
            throw new common_1.HttpException("Asset not found", common_1.HttpStatus.NOT_FOUND);
        if (!replyTo) {
            const newComment = new this.commentModel({
                content,
                author,
                asset,
                isReply: false
            });
            await newComment.save();
            asset.comments.push(newComment);
            await asset.save();
            return newComment;
        }
        const comment = await this.commentModel.findById(replyTo);
        if (!comment)
            throw new common_1.HttpException("Comment for reply not found", common_1.HttpStatus.NOT_FOUND);
        let firstLevelComment = comment;
        while (firstLevelComment.isReply) {
            firstLevelComment = await this.commentModel.findById(firstLevelComment.replyTo);
        }
        const reply = new this.commentModel({
            content,
            author,
            asset,
            isReply: true,
            replyTo: comment
        });
        await reply.save();
        firstLevelComment.replies.push(reply);
        await firstLevelComment.save();
        return reply;
    }
};
CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(comments_schema_1.Comment.name)),
    __param(2, (0, mongoose_1.InjectModel)(currency_schema_1.Currency.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CommentsService);
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments.service.js.map