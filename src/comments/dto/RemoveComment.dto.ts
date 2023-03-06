import { IsNotEmpty, IsString } from "class-validator";

export class RemoveCommentDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;
}