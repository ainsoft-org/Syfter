import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Currency } from "../alphavantage/currency.schema";

export type NewsDocument = HydratedDocument<News>;

@Schema()
class Topic {
  @Prop(String)
  topic: string;
  @Prop(Number)
  relevance_score: number;
}
const TopicSchema = SchemaFactory.createForClass(Topic);

@Schema()
class Sentiment {
  @Prop(String)
  ticker: string;
  @Prop(Number)
  relevance_score: number;
  @Prop(Number)
  sentiment_score: number;
  @Prop(String)
  sentiment_label: string;
}
const SentimentSchema = SchemaFactory.createForClass(Sentiment);

@Schema({ timestamps: true })
export class News {
  @Prop({ type: Number, default: 0 })
  likes: number;
  @Prop({ type: Number, default: 0 })
  dislikes: number;

  @Prop({type: Number, default: 0})
  coeffLike: number;
  @Prop({ type: Date, default: new Date() })
  timePrevLike: Date;


  @Prop({ type: String, required: true })
  AssetType: string;


  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  url: string;
  @Prop({ type: Date })
  time_published: Date;
  @Prop({ type: [String] })
  authors: string[];
  @Prop({ type: String })
  summary: string;
  @Prop({ type: String })
  banner_image: string;
  @Prop({ type: String })
  source: string;
  @Prop({ type: String })
  category_within_source: string;
  @Prop({ type: String })
  source_domain: string;
  @Prop({ type: Number })
  sentiment_score: number;
  @Prop({ type: String })
  sentiment_label: string;

  @Prop({ type: String })
  newsId: string;
  @Prop({ type: [{ type: TopicSchema }] })
  topics: Topic;
  @Prop({ type: [SentimentSchema] })
  sentiments: Sentiment[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'currency' })
  currency: Currency;
}

export const NewsSchema = SchemaFactory.createForClass(News);
