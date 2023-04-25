import { IsNotEmpty, IsString } from "class-validator";

export class SignInTwitterDto {
  @IsString()
  @IsNotEmpty()
  twitterID: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}