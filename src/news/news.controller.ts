import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { NewsService } from "./news.service";
import { AuthGuard } from "@nestjs/passport";
import { GetRecommendationDto } from "../alphavantage/dto/GetRecommendation.dto";
import { IsString } from "class-validator";

class newsIdDto {
  @IsString()
  newsId: string;
}

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('topNews')
  async topNews(@Request() req, @Body() dto: GetRecommendationDto) {
    return this.newsService.getNews(dto.amount, dto?.filters ? dto.filters : {}, dto.forIgnore);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('likeNews')
  async likeNews(@Request() req, @Body() dto: newsIdDto) {
    return this.newsService.likeNews(req.user.sub, dto.newsId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('dislikeNews')
  async dislikeNews(@Request() req, @Body() dto: newsIdDto) {
    return this.newsService.dislikeNews(req.user.sub, dto.newsId);
  }
}
