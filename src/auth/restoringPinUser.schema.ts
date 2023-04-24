import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";

export type RestoringPinUserDocument = HydratedDocument<RestoringPinUser>;

@Schema({ timestamps: true })
export class RestoringPinUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true })
  userID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  restoreToken: string;

  @Prop({ type: String, required: true, select: false })
  verificationCode: string;

  @Prop({ type: Number, default: 1 })
  sentConfirmations: number;

  @Prop({ type: Date, default: new Date() })
  prevCodeTime: Date;

  @Prop({ type: Boolean, default: false })
  confirmed: boolean;
}

export const RestoringPinUserSchema = SchemaFactory.createForClass(RestoringPinUser);
