import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { User } from "../user/user.schema";
// import { Address } from "../addresses/address.schema";
import * as dotenv from 'dotenv'
dotenv.config();

export type RegisteringUserDocument = HydratedDocument<RegisteringUser>;

@Schema({ timestamps: true })
export class RegisteringUser extends User {
  @Prop({ type: String, unique: true, required: true })
  regToken: string

  @Prop({ type: String, default: "SMS" })
  stage: string;

  @Prop({ type: String, select: false })
  verificationCode: string;

  @Prop({ type: Number, default: 1 })
  sentConfirmations: number;

  @Prop({ type: Date, default: new Date() })
  prevCodeTime: Date;

  @Prop({ type: String })
  image: string;
}

export const RegisteringUserSchema = SchemaFactory.createForClass(RegisteringUser);
