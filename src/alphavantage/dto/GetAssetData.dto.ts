import { IsString } from "class-validator"
import { ChartIntervalDto } from "./ChartInterval.dto";
import { Type } from "class-transformer";

export class GetAssetDataDto extends ChartIntervalDto {
  @IsString({each: true})
  assets: string[];
}