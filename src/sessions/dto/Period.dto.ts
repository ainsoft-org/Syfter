import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";

export enum Period {
  "6months",
  "week",
  "month",
  "3months"
}

export class PeriodDto {
  @IsString()
  @IsNotEmpty()
  // @Matches(`^${Object.values(UserRole).filter(v => typeof v !== "number").join('|')}$`, 'i'
  @IsEnum(Period, {
    message: `must be week|month|3months|6months`
  })
  period: string;
}