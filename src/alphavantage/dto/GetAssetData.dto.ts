import { IsEnum, IsOptional, IsString } from "class-validator";
import { ChartIntervalDto } from "./ChartInterval.dto";
import { Type } from "class-transformer";

export enum ChartTypes {
  "regular",
  "candlestick"
}

export class GetAssetDataDto extends ChartIntervalDto {
  @IsString({each: true})
  assets: string[];

  @IsOptional()
  @IsString()
  @IsEnum(ChartTypes, {
    message: `must be regular|candlestick`
  })
  chartType?: string;
}