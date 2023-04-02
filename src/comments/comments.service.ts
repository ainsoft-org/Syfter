import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/user.schema";
import mongoose, { Model } from "mongoose";
import { CommentDocument, Comment } from "./comments.schema";
import { Currency, CurrencyDocument } from "../alphavantage/currency.schema";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>,
  ) {}

  async addComment(userId: string, assetId: string, content: string, replyTo = "") {
    const author = await this.userModel.findById(userId);
    if(!author.twitterId) {
      throw new HttpException("Only users who have linked their twitter account can add comments",  HttpStatus.FORBIDDEN);
    }

    const asset = await this.currencyModel.findById(assetId).select("comments");
    if(!asset) throw new HttpException("Asset not found", HttpStatus.NOT_FOUND);

    if(!replyTo) {
      const newComment: any = new this.commentModel({
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
    if(!comment) throw new HttpException("Comment for reply not found", HttpStatus.NOT_FOUND);
    if(comment.asset.toString() !== assetId) throw new HttpException("The replyTo asset and the reply asset are different", HttpStatus.BAD_REQUEST);

    const mainComment = await this.commentModel.findById(comment.mainComment).select("replies") || comment;

    const reply: any = new this.commentModel({
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

  async removeComment(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId).select("+replies");
    if(!comment) throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);
    if(comment.author.toString() !== userId) throw new HttpException("No access", HttpStatus.FORBIDDEN);

    const asset = await this.currencyModel.findById(comment.asset).select("comments");
    if(asset) {
      const commentIndex = asset.comments.findIndex(assetComment => assetComment.toString() === commentId);
      if(commentIndex !== -1) {
        asset.comments.splice(commentIndex, 1);
        await asset.save();
      }
    }

    if(comment.isReply) {
      const mainComment = await this.commentModel.findById(comment.mainComment);

      const replyIndex = mainComment.replies.findIndex(reply => reply.toString() === commentId);
      if(replyIndex !== -1) {
        mainComment.replies.splice(replyIndex, 1);
      }
      await mainComment.save();
    }
    for(let i=0; i<comment.replies.length; i++) {
      try {
        await this.commentModel.findByIdAndDelete(comment.replies);
      } catch (err) {
        console.log(err);
      }
    }

    const user = await this.userModel.findById(userId);
    const commentIndex = user.comments.findIndex(userComment => userComment.toString() === commentId);
    if(commentIndex !== -1) {
      user.comments.splice(commentIndex, 1);
    }

    await user.save();
    await comment.remove();

    return { message: "removed" };
  }

  async likeComment(userId: string, commentId: string) {
    const user = await this.userModel.findById(userId);
    const comment = await this.commentModel.findById(commentId);
    if(!comment) throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);

    const likedCommentIndex = user.likedComments.findIndex(liked => liked.toString() === commentId);
    if(likedCommentIndex !== -1) {
      // throw new HttpException("Already liked", HttpStatus.BAD_REQUEST);
      comment.likes--;
      user.likedComments.splice(likedCommentIndex, 1);
      await user.save();
      await comment.save();
      return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: false, isDisliked: false };
    }

    const dislikedCommentIndex = user.dislikedComments.findIndex(disliked => disliked.toString() === commentId);
    if(dislikedCommentIndex !== -1) {
      user.dislikedComments.splice(dislikedCommentIndex);
      comment.dislikes--;
    }

    comment.likes++;

    user.likedComments.push(comment);

    await comment.save();
    await user.save();
    return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: true, isDisliked: false };
  }

  async dislikeComment(userId: string, commentId: string) {
    const user = await this.userModel.findById(userId);
    const comment = await this.commentModel.findById(commentId);
    if(!comment) throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);

    const dislikedCommentIndex = user.dislikedComments.findIndex(disliked => disliked.toString() === commentId);
    if(dislikedCommentIndex !== -1) {
      comment.dislikes--;
      user.dislikedComments.splice(dislikedCommentIndex, 1);
      await user.save();
      await comment.save();
      return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: false, isDisliked: false };
    }

    const likedCommentIndex = user.likedComments.findIndex(liked => liked.toString() === commentId);
    if(likedCommentIndex !== -1) {
      user.likedComments.splice(likedCommentIndex);
      comment.likes--;
    }

    comment.dislikes++;
    user.dislikedComments.push(comment);
    await comment.save();
    await user.save();
    return { ...comment.toObject(), reputation: comment.likes - comment.dislikes, isLiked: false, isDisliked: true };
  }

  async getIdeas(userId: string, asset: string, amount: number, sortBy: string, forIgnore: string[], repliesTo: string) {
    const user = await this.userModel.findById(userId).select("likedComments dislikedComments twitterId");

    const sortByKey: any = {};
    if(sortBy === "reputation") {
      sortByKey.createdAt = -1;
    } else {
      sortByKey.reputation = -1;
    }

    const match: any = {};
    if(repliesTo) {
      const comment = await this.commentModel.findById(repliesTo).select("replies");
      if(!comment) throw new HttpException("Comment not found", HttpStatus.NOT_FOUND);
      match._id = {
        $in: comment.replies.map(id => new mongoose.Types.ObjectId(id.toString()))
      };
    }

    const ideas = await this.commentModel.aggregate([
      {$match: {
        asset: new mongoose.Types.ObjectId(asset),
        _id: {
          $nin: forIgnore.map(id => new mongoose.Types.ObjectId(id))
        },
        ...match
      }},
      {$addFields: {
        reputation: {$subtract: ["$likes", "$dislikes"]}
      }},
      {$sort: {
        ...sortByKey
      }},
      {$limit: amount},
      {$lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }},
      {$unwind:
        "$author"
      },
      {$addFields: {
        isLiked: { $in: ["$_id", user.likedComments] },
        isDisliked: { $in: ["$_id", user.dislikedComments] }
      }},
      {$project: {
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
      }}
    ]);

    return { ideas, isTwitterConnected: user.twitterId ? true : false };
  }

}
