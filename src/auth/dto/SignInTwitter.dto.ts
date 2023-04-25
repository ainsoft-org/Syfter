import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignInTwitterDto {
  @IsString()
  @IsNotEmpty()
  twitterID: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string;
}