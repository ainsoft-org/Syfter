import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "@nestjs/passport";
import { AddCommentDto } from "./dto/AddComment.dto";
import { RemoveCommentDto } from "./dto/RemoveComment.dto";
import { LikeCommentDto } from "./dto/LikeComment.dto";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

enum SortByEnum {
  "date",
  "reputation"
}

export class GetIdeasDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(SortByEnum)
  sortBy?: string;

  @IsOptional()
  @IsArray()
  forIgnore: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  repliesTo?: string;
}

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async add(@Request() req, @Body() dto: AddCommentDto) {
    return this.commentsService.addComment(req.user.sub, dto.assetId, dto.content, dto.replyTo || "");
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove')
  async remove(@Request() req, @Body() dto: RemoveCommentDto) {
    return this.commentsService.removeComment(req.user.sub, dto.commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('like')
  async like(@Request() req, @Body() dto: LikeCommentDto) {
    return this.commentsService.likeComment(req.user.sub, dto.commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('dislike')
  async dislike(@Request() req, @Body() dto: LikeCommentDto) {
    return this.commentsService.dislikeComment(req.user.sub, dto.commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ideas')
  async ideas(@Request() req, @Body() dto: GetIdeasDto) {
    return this.commentsService.getIdeas(dto.amount, dto.sortBy, dto.forIgnore || [], dto.repliesTo || "");
  }
}
