import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { NewsService } from "./news.service";
import { AuthGuard } from "@nestjs/passport";
import { GetRecommendationDto } from "../alphavantage/dto/GetRecommendation.dto";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

class newsIdDto {
  @IsString()
  newsId: string;
}

enum periodEnum {
  "old" = "old",
  "new" = "new"
}

class FiltersDto {
  @IsOptional()
  @IsBoolean()
  isCryptocurrency?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(periodEnum)
  period?: periodEnum;
}

class GetNewsDto {
  @IsOptional()
  @IsArray()
  forIgnore?: string[];

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @Type(() => FiltersDto)
  filters?: FiltersDto;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  asset?: string;
}

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('topNews')
  async topNews(@Request() req, @Body() dto: GetNewsDto) {
    return this.newsService.getNews(req.user.sub, dto.amount, dto?.asset || "",  dto?.filters || {}, dto.forIgnore || []);
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
