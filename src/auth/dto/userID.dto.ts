import { IsNotEmpty, IsString } from "class-validator";

export class UserIDDto {
  @IsNotEmpty()
  @IsString()
  userID: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}