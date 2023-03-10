import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from "../user/user.schema";
import * as dotenv from 'dotenv'
dotenv.config();

export type AuthingUserDocument = HydratedDocument<AuthingUser>;

@Schema({ timestamps: true })
export class AuthingUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true })
  userID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  authToken: string;
}

export const AuthingUserSchema = SchemaFactory.createForClass(AuthingUser);
