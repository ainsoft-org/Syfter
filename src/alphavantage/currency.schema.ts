import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { News } from "../news/news.schema";

export type CurrencyDocument = HydratedDocument<Currency>;

@Schema({ timestamps: true })
export class Currency {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment", select: false }] })
  comments: Comment[];

  @Prop({ type: Number, default: 0 })
  likes: number;
  @Prop({ type: Number, default: 0 })
  dislikes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }], select: false})
  news: News[];

  @Prop({ type: String, required: true, unique: true })
  Symbol: string;
  @Prop({ type: String, required: true })
  AssetType: string;
  @Prop({ type: String })
  Name: string;
  @Prop({ type: String })
  Description: string;
  @Prop({ type: Number })
  CIK: number;
  @Prop({ type: String })
  Exchange: string;
  @Prop({ type: String })
  Currency: string;
  @Prop({ type: String })
  Country: string;
  @Prop({ type: String })
  Sector: string;
  @Prop({ type: String })
  Industry: string;
  @Prop({ type: String })
  Address: string;
  @Prop({ type: String })
  FiscalYearEnd: string;
  @Prop({ type: String })
  LatestQuarter: string;
  @Prop({ type: Number })
  MarketCapitalization: number;

  @Prop({ type: Number })
  ExchangeRate: number;

  @Prop({ type: Date })
  IpoDate: Date;

  @Prop({ type: Number })
  Volume24h: number;

  @Prop({ type: Number })
  boomRatio: number;

  @Prop({ type: Number })
  percentChange24h: number;

  @Prop({ type: Number })
  newsBoomRatio: number;

  @Prop({ type: Number, default: 0 })
  priority: number;

  // @Prop({ type: Number })
  // EBITDA: number;
  // @Prop({ type: Number })
  // PERatio: number;
  // @Prop({ type: Number })
  // PEGRatio: number;
  // @Prop({ type: Number })
  // BookValue: number;
  // @Prop({ type: Number })
  // DividendPerShare: number;
  // @Prop({ type: Number })
  // DividendYield: number;
  // @Prop({ type: Number })
  // EPS: number;
  // @Prop({ type: Number })
  // RevenuePerShareTTM: number;
  // @Prop({ type: Number })
  // ProfitMargin: number;
  // @Prop({ type: Number })
  // OperatingMarginTTM: number;
  // @Prop({ type: Number })
  // ReturnOnAssetsTTM: number;
  // @Prop({ type: Number })
  // ReturnOnEquityTTM: number;
  // @Prop({ type: Number })
  // RevenueTTM: number;
  // @Prop({ type: Number })
  // GrossProfitTTM: number;
  // @Prop({ type: Number })
  // DilutedEPSTTM: number;
  // @Prop({ type: Number })
  // QuarterlyEarningsGrowthYOY: number;
  // @Prop({ type: Number })
  // QuarterlyRevenueGrowthYOY: number;
  // @Prop({ type: Number })
  // AnalystTargetPrice: number;
  // @Prop({ type: Number })
  // TrailingPE: number;
  // @Prop({ type: Number })
  // ForwardPE: number;
  // @Prop({ type: Number })
  // PriceToSalesRatioTTM: number;
  // @Prop({ type: Number })
  // PriceToBookRatio: number;
  // @Prop({ type: Number })
  // EVToRevenue: number;
  // @Prop({ type: Number })
  // EVToEBITDA: number;
  // @Prop({ type: Number })
  // Beta: number;
  // @Prop({ type: Number })
  // "52WeekHigh": number;
  // @Prop({ type: Number })
  // "52WeekLow": number;
  // @Prop({ type: Number })
  // "50DayMovingAverage": number;
  // @Prop({ type: Number })
  // "200DayMovingAverage": number;
  // @Prop({ type: String })
  // SharesOutstanding: string;
  // @Prop({ type: String })
  // DividendDate: string;
  // @Prop({ type: String })
  // ExDividendDate: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
