import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "@nestjs/passport";
import { AddCommentDto } from "./dto/AddComment.dto";

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
}
