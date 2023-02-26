import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum ChartIntervals {
  "24H",
  "1H",
  "5H",
  "15D",
  "1M",
  "1W",
  "5M",
  "1Y",
  "All"
}

export class ChartIntervalDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ChartIntervals, {
    message: `must be 1H|5H|24H|1W|15D|1M|5M|1Y|All`
  })
  interval?: string;
}