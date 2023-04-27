import { Body, Controller, Post, Request, UseGuards, Get } from "@nestjs/common";
import { AlphavantageService } from "./alphavantage.service";
import { AuthGuard } from "@nestjs/passport";
import { GetRecommendationDto } from "./dto/GetRecommendation.dto";
import { GetAssetDataDto } from "./dto/GetAssetData.dto";
import { ReactToAssetDto } from "./dto/ReactToAsset.dto";
import { AdminGuard } from "../auth/guards/Admin.guard";
import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";
import { FiltersDto } from "./dto/Filters.dto";

class SetPriorityDto {
  @IsString()
  assetId: string;

  @IsNumber()
  priority: number;
}

class AssetIdDto {
  @IsString()
  assetId: string;
}

class FindAssetDto {
  @IsArray()
  assets: string[];
}

@Controller('alphavantage')
export class AlphavantageController {
  constructor(private aplhavantageService: AlphavantageService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('getFilterDispersions')
  getFilterDispersions() {
    return this.aplhavantageService.getFilterDispersions();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getRecommendation')
  getRecommendation(@Request() req, @Body() dto: GetRecommendationDto) {
    return this.aplhavantageService.getRecommendation(req.user.sub, dto?.filters, dto.amount, dto?.forIgnore, dto?.type);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getAssetData')
  async getAssetData(@Request() req, @Body() dto: GetAssetDataDto) {
    const assets = await this.aplhavantageService.getAssetsById(dto.assets);
    return this.aplhavantageService.getAssetData(assets, dto.interval || "24H", dto?.chartType);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reactToAsset')
  async reactToAsset(@Request() req, @Body() dto: ReactToAssetDto) {
    return this.aplhavantageService.reactToAsset(dto, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeReaction')
  async removeReaction(@Request() req, @Body('assetId') assetId: string) {
    return this.aplhavantageService.removeReaction(assetId, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('trendingNow')
  async trendingNow(@Request() req, @Body() dto: GetRecommendationDto) {
    return this.aplhavantageService.getTrendingNow(req.user.sub, dto.amount, dto.forIgnore ? dto.forIgnore : [], dto?.filters);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('setPriority')
  async setPriority(@Body() dto: SetPriorityDto) {
    return this.aplhavantageService.setAssetPriority(dto.assetId, dto.priority);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('watchlist')
  async watchlist(@Request() req, @Body() dto: GetRecommendationDto) {
    return this.aplhavantageService.getWatchlist(req.user.sub, dto.amount, dto.forIgnore ? dto.forIgnore : [], dto?.filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('favourites')
  async favourites(@Request() req, @Body() dto: GetRecommendationDto) {
    return this.aplhavantageService.getFavourites(req.user.sub, dto.amount, dto.forIgnore ? dto.forIgnore : [], dto?.filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getAssetsById')
  async getAssetsById(@Body() dto: FindAssetDto) {
    return this.aplhavantageService.getAssetsByIds(dto.assets, [], dto.assets.length, {});
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addFavourite')
  async addToFavourites(@Request() req, @Body() dto: AssetIdDto) {
    return this.aplhavantageService.addAssetToFavourites(req.user.sub, dto.assetId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeFavourite')
  async removeFavourite(@Request() req, @Body() dto: AssetIdDto) {
    return this.aplhavantageService.removeFavourite(req.user.sub, dto.assetId);
  }
}
