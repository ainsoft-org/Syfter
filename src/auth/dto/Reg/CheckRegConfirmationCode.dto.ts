import { IsNumberString, IsUUID, Length } from "class-validator";

export class CheckRegConfirmationCode {
  @IsUUID(4)
  regToken: string;

  @IsNumberString()
  @Length(4)
  code: string;
}