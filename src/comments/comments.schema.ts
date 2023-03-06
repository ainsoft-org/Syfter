import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Currency } from "../alphavantage/currency.schema";
import { User } from "../user/user.schema";
import * as process from "process";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true, minlength: Number(process.env.commentMinLength), maxlength: Number(process.env.commentMaxLength) })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "user", immutable: true })
  author: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "currency", immutable: true })
  asset: Currency;

  @Prop({ type: Boolean, required: true })
  isReply: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "comment", immutable: true })
  replyTo?: Comment;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] })
  replies: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "comment", immutable: true })
  mainComment?: Comment;

  validate() {
    if (this.isReply && this.replies) {
      throw new Error('replies can only exist when isReply is false');
    }

    if (!this.isReply && this.replyTo) {
      throw new Error('replyTo can only exist when isReply is true');
    }
  }

  @Prop({ type: Number, default: 0 })
  likes: number;
  @Prop({ type: Number, default: 0 })
  dislikes: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);