import { IsString, IsUUID, Matches } from "class-validator";

export class SetAddressRegDto {
  @IsUUID(4)
  regToken: string;

  @IsString()
  @Matches(new RegExp(process.env.networkForFreeTokensRegExp))
  address: string;

  @IsString()
  device: string;

  @IsString()
  ip: string;

  @IsString()
  deviceID: string;
}