import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum UserRole {
  "user",
  "pro",
  "moderator",
  "admin"
}

export class UserRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: `must be user|pro|moderator|admin`
  })
  role: string;
}