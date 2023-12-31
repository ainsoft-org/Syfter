import { IsNumberString, IsUUID, Length } from "class-validator";

export class CheckRegConfirmationCode {
  @IsUUID(4)
  regToken: string;

  @IsNumberString()
  @Length(5, 5)
  code: string;
}