import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { Address } from "../addresses/address.schema";
import { Session } from "../sessions/session.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  mobileNumber: string;

  @Prop({ type: String, select: false, length: 4 })
  pin: string;

  @Prop({ type: [String], enum: ["user", "pro", "moderator", "admin"], default: ["user"] })
  roles: string[];

  @Prop(String)
  username: string;

  @Prop(String)
  email: string;
  @Prop({ type: Boolean, default: false })
  emailConfirmed: boolean;
  @Prop({ type: Boolean, default: true })
  acceptNotifications: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }], default: [] })
  sessions: Session[];
  @Prop({ type: String, enum: ["week", "month", "3months", "6months"], default: "6months" })
  sessionTerminationTimeframe: string;

  @Prop({ type: Date, default: new Date() })
  lastActivity: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }], default: [] })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
