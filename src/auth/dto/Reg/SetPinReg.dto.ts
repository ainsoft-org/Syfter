import { IsBoolean, IsNumberString, IsOptional, IsUUID, Length } from "class-validator";

export class SetPinRegDto {
  @IsUUID(4)
  regToken: string;

  @IsNumberString()
  @Length(4, 4)
  pin: string;

  @IsOptional()
  @IsBoolean()
  flag?: boolean;
}