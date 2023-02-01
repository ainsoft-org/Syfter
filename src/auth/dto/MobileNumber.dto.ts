import { IsNumberString, IsPhoneNumber } from "class-validator";

export class MobileNumberDto {
  @IsPhoneNumber()
  number: string;
}