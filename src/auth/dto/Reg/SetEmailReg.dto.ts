import { IsBoolean, IsEmail, IsUUID } from "class-validator";

export class SetEmailRegDto {
  @IsUUID(4)
  regToken: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  acceptNotifications: boolean;
}