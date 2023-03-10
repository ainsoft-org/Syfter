import { IsBoolean, IsNumberString, IsOptional, IsPhoneNumber } from "class-validator";

export class MobileNumberDto {
  @IsPhoneNumber()
  number: string;
}