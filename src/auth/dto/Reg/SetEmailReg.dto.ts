import { IsBoolean, IsEmail, IsOptional, IsUUID } from "class-validator";

export class SetEmailRegDto {
  @IsUUID(4)
  regToken: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  acceptNotifications: boolean;

  @IsOptional()
  @IsBoolean()
  flag?: boolean;
}