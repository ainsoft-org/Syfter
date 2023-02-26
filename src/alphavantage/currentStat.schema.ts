import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CurrentStatDocument = HydratedDocument<CurrentStat>;

@Schema({ timestamps: true })
export class CurrentStat {
  @Prop({ type: Number })
  requestsAmount: number;


}

export const CurrentStatSchema = SchemaFactory.createForClass(CurrentStat);
