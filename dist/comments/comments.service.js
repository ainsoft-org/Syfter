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
        if (!author.twitterId) {
            throw new common_1.HttpException("Only users who have linked their twitter account can add comments", common_1.HttpStatus.FORBIDDEN);
        }
        const asset = await this.currencyModel.findById(assetId).select("comments");
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
        if (comment.asset.toString() !== assetId)
            throw new common_1.HttpException("The replyTo asset and the reply asset are different", common_1.HttpStatus.BAD_REQUEST);
        const mainComment = await this.commentModel.findById(comment.mainComment).select("replies") || comment;
        const reply = new this.commentModel({
            content,
            author,
            asset,
            isReply: true,
            replyTo: comment,
            mainComment
        });
        await reply.save();
        mainComment.replies.push(reply);
        await mainComment.save();
        asset.comments.push(reply);
        await asset.save();
        return reply;
    }
    async removeComment(userId, commentId) {
        const comment = await this.commentModel.findById(commentId).select("+replies");
        if (!comment)
            throw new common_1.HttpException("Comment not found", common_1.HttpStatus.NOT_FOUND);
        if (comment.author.toString() !== userId)
            throw new common_1.HttpException("No access", common_1.HttpStatus.FORBIDDEN);
        const asset = await this.currencyModel.findById(comment.asset).select("comments");
        if (asset) {
            const commentIndex = asset.comments.findIndex(assetComment => assetComment.toString() === commentId);
            if (commentIndex !== -1) {
                asset.comments.splice(commentIndex, 1);
                await asset.save();
            }
        }
        if (comment.isReply) {
            const mainComment = await this.commentModel.findById(comment.mainComment);
            const replyIndex = mainComment.replies.findIndex(reply => reply.toString() === commentId);
            if (replyIndex !== -1) {
                mainComment.replies.splice(replyIndex, 1);
            }
            await mainComment.save();
        }
        for (let i = 0; i < comment.replies.length; i++) {
            try {
                await this.commentModel.findByIdAndDelete(comment.replies);
            }
            catch (err) {
                console.log(err);
            }
        }
        const user = await this.userModel.findById(userId);
        const commentIndex = user.comments.findIndex(userComment => userComment.toString() === commentId);
        if (commentIndex !== -1) {
            user.comments.splice(commentIndex, 1);
        }
        await user.save();
        await comment.remove();
        return { message: "removed" };
    }
    async likeComment(userId, commentId) {
        const user = await this.userModel.findById(userId);
        const comment = await this.commentModel.findById(commentId);
        if (!comment)
            throw new common_1.HttpException("Comment not found", common_1.HttpStatus.NOT_FOUND);
        const likedCommentIndex = user.likedComments.findIndex(liked => liked.toString() === commentId);
        if (likedCommentIndex !== -1) {
            comment.likes--;
            user.likedComments.splice(likedCommentIndex, 1);
            await user.save();
            await comment.save();
            return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: false, isDisliked: false };
        }
        const dislikedCommentIndex = user.dislikedComments.findIndex(disliked => disliked.toString() === commentId);
        if (dislikedCommentIndex !== -1) {
            user.dislikedComments.splice(dislikedCommentIndex);
            comment.dislikes--;
        }
        comment.likes++;
        user.likedComments.push(comment);
        await comment.save();
        await user.save();
        return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: true, isDisliked: false };
    }
    async dislikeComment(userId, commentId) {
        const user = await this.userModel.findById(userId);
        const comment = await this.commentModel.findById(commentId);
        if (!comment)
            throw new common_1.HttpException("Comment not found", common_1.HttpStatus.NOT_FOUND);
        const dislikedCommentIndex = user.dislikedComments.findIndex(disliked => disliked.toString() === commentId);
        if (dislikedCommentIndex !== -1) {
            comment.dislikes--;
            user.dislikedComments.splice(dislikedCommentIndex, 1);
            await user.save();
            await comment.save();
            return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: false, isDisliked: false };
        }
        const likedCommentIndex = user.likedComments.findIndex(liked => liked.toString() === commentId);
        if (likedCommentIndex !== -1) {
            user.likedComments.splice(likedCommentIndex);
            comment.likes--;
        }
        comment.dislikes++;
        user.dislikedComments.push(comment);
        await comment.save();
        await user.save();
        return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: false, isDisliked: true };
    }
    async getIdeas(userId, asset, amount, sortBy, forIgnore, repliesTo) {
        const user = await this.userModel.findById(userId).select("likedComments dislikedComments twitterId");
        const sortByKey = {};
        if (sortBy === "reputation") {
            sortByKey.createdAt = -1;
        }
        else {
            sortByKey.reputation = -1;
        }
        const match = {};
        if (repliesTo) {
            const comment = await this.commentModel.findById(repliesTo).select("replies");
            if (!comment)
                throw new common_1.HttpException("Comment not found", common_1.HttpStatus.NOT_FOUND);
            match._id = {
                $in: comment.replies.map(id => new mongoose_2.default.Types.ObjectId(id.toString()))
            };
        }
        const ideas = await this.commentModel.aggregate([
            { $match: {
                    asset: new mongoose_2.default.Types.ObjectId(asset),
                    _id: {
                        $nin: forIgnore.map(id => new mongoose_2.default.Types.ObjectId(id))
                    },
                    ...match
                } },
            { $addFields: {
                    reputation: { $subtract: ["$likes", "$dislikes"] }
                } },
            { $sort: {
                    ...sortByKey
                } },
            { $limit: amount },
            { $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                } },
            { $unwind: "$author"
            },
            { $addFields: {
                    isLiked: { $in: ["$_id", user.likedComments] },
                    isDisliked: { $in: ["$_id", user.dislikedComments] }
                } },
            { $project: {
                    "_id": 1,
                    "content": 1,
                    "asset": 1,
                    "replyTo": 1,
                    "isReply": 1,
                    "replies": 1,
                    "reputation": 1,
                    "createdAt": 1,
                    "author.image": 1,
                    "author.username": 1,
                    "isLiked": 1,
                    "isDisliked": 1
                } }
        ]);
        return { ideas, isTwitterConnected: user.twitterId ? true : false };
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