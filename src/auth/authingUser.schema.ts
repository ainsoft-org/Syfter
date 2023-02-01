import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from "../user/user.schema";
import * as dotenv from 'dotenv'
dotenv.config();

export type AuthingUserDocument = HydratedDocument<AuthingUser>;

@Schema({ timestamps: true })
export class AuthingUser {
  @Prop({ type: String, required: true })
  mobileNumber: string;

  @Prop({ type: String, unique: true, required: true })
  authToken: string;

  @Prop({ type: String, required: true, select: false })
  verificationCode: string;

  @Prop({ type: Number, default: 1 })
  sentConfirmations: number;

  @Prop({ type: Date, default: new Date() })
  prevCodeTime: Date;
}

export const AuthingUserSchema = SchemaFactory.createForClass(AuthingUser);
