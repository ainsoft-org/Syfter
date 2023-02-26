import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class FiltersDto {
  @IsOptional()
  @IsBoolean()
  isCryptocurrency?: boolean;

  @IsOptional()
  @IsNumber()
  minPrice?: number;
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  minMarketCap?: number;
  @IsOptional()
  @IsNumber()
  maxMarketCap?: number;

  @IsOptional()
  @IsNumber()
  minCompanyAge?: number;
  @IsOptional()
  @IsNumber()
  maxCompanyAge?: number;

  @IsOptional()
  @IsNumber()
  minPercentChange?: number;
  @IsOptional()
  @IsNumber()
  maxPercentChange?: number;

  @IsOptional()
  @IsNumber()
  minVolume?: number;
  @IsOptional()
  @IsNumber()
  maxVolume?: number;
}