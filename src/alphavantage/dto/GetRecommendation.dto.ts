import { FiltersDto } from "./Filters.dto";
import { IsArray, IsNumber, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class GetRecommendationDto {
  @IsOptional()
  @IsArray()
  forIgnore?: string[];

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @Type(() => FiltersDto)
  filters?: FiltersDto;

  @IsOptional()
  type?: string;
}