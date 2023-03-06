import { IsNotEmpty, IsString } from "class-validator";

export class LikeCommentDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;
}