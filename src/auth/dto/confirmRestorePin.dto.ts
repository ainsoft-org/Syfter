import { IsNumberString, IsUUID, Length } from "class-validator";

export class ConfirmRestorePinDto {
  @IsUUID(4)
  restoreToken: string;

  @IsNumberString()
  @Length(5, 5)
  code: string;
}