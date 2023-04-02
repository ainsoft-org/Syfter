import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { Address } from "../addresses/address.schema";
import { Session } from "../sessions/session.schema";
import { Period } from '../sessions/dto/Period.dto'
import { UserRole } from "../auth/dto/UserRole.dto";
import { Currency } from "../alphavantage/currency.schema";
import { News } from "../news/news.schema";
import { Comment } from "../comments/comments.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
class Reaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "currency", required: true })
  asset: Currency;
  @Prop({ type: Boolean, required: true })
  isLiked: boolean;
}
const ReactionSchema = SchemaFactory.createForClass(Reaction);

@Schema({ timestamps: true })
export class SectorLikes {
  @Prop({ type: String, required: true })
  Sector: string;
  @Prop({ type: Number, default: 1 })
  likes: number;
}
const SectorLikesSchema = SchemaFactory.createForClass(SectorLikes);

@Schema({ timestamps: true })
export class User {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] })
  comments: Comment[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] })
  likedComments: Comment[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] })
  dislikedComments: Comment[];

  @Prop({ type: [ReactionSchema] })
  reactions: Reaction[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "currency" }] })
  removedReactions: Currency[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }] })
  dislikedNews: News[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }] })
  likedNews: News[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }] })
  removedLikedNews: News[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "currency" }]  })
  favourites: Currency[];

  @Prop({ type: [SectorLikesSchema] })
  likedSectors: SectorLikes[];

  @Prop({ type: String, select: false })
  mobileNumber: string;

  @Prop({ type: String, select: false, length: 4 })
  pin: string;

  @Prop({ type: [String], enum: UserRole, default: UserRole[0], select: false })
  roles: string[];

  @Prop(String)
  username: string;

  @Prop({ type: String, select: false })
  email: string;
  @Prop({ type: Boolean, default: false, select: false })
  emailConfirmed: boolean;
  @Prop({ type: Boolean, default: true })
  acceptNotifications: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }], select: false })
  sessions: Session[];
  @Prop({ type: String, enum: Period, default: Period[0] })
  sessionTerminationTimeframe: string;


  @Prop({ type: String, unique: false })
  twitterId: string;
  @Prop({ type: String })
  image: string;


  @Prop({ type: Date, default: new Date() })
  lastActivity: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }], select: false })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
