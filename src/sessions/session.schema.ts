import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from "../user/user.schema";

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: String, required: true })
  device: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, select: false, required: false })
  refreshToken: string;

  @Prop({ type: String, required: true, select: false }) // , unique: true
  deviceID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true })
  user: User;

  @Prop({ type: Date, default: new Date() })
  lastActivity: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
