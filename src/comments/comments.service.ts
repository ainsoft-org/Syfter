import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
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

    const asset = await this.currencyModel.findById(assetId);
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

    let firstLevelComment = comment;
    while(firstLevelComment.isReply) {
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

}
