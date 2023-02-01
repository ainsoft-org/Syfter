import { IsNumberString, Length } from "class-validator";

export class PinCodeDto {
  @IsNumberString()
  @Length(4, 4)
  pin: string;
}