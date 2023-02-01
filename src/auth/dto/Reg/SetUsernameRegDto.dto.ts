import { IsString, IsUUID, Length } from "class-validator";

export class SetUsernameRegDto {
  @IsUUID(4)
  regToken: string;

  @IsString()
  @Length(2, 30)
  username: string;
}