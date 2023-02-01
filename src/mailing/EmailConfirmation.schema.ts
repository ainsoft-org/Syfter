import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { Address } from "../addresses/address.schema";
import { Session } from "../sessions/session.schema";
import { User } from '../user/user.schema';

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;

@Schema({ timestamps: true })
export class EmailConfirmation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);
