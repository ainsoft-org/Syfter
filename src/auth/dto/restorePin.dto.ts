import { IsNumberString, IsUUID, Length } from "class-validator";

export class RestorePinDto {
  @IsUUID(4)
  restoreToken: string;

  @IsNumberString()
  @Length(4, 4)
  pin: string;
}