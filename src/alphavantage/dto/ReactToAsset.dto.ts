import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ReactToAssetDto {
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsBoolean()
  reaction: boolean;
}