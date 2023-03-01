import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsString()
  @MinLength(Number(process.env.commentMinLength))
  @MaxLength(Number(process.env.commentMaxLength))
  content: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  replyTo?: string;
}