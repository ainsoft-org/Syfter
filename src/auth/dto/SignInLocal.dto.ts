import { IsNumberString, IsString, IsUUID, Length } from "class-validator";

export class SignInLocalDto {
  @IsUUID('4')
  authToken: string;

  @IsNumberString()
  @Length(4, 4)
  pin: string;

  @IsString()
  device: string;

  @IsString()
  ip: string;

  @IsString()
  deviceID: string;
}