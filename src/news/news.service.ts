import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { News, NewsDocument } from "./news.schema";
import mongoose, { Model } from "mongoose";
import { Cache } from "cache-manager";
import { User, UserDocument } from "../user/user.schema";
import { Readability } from "@mozilla/readability";
import { JSDOM } from 'jsdom';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {

  }

  async likeNews(userId: string, newsId: string) {
    const user = await this.userModel.findById(userId);
    const news = await this.newsModel.findById(newsId);
    if(!news) throw new HttpException("News not found", HttpStatus.NOT_FOUND);

    const likedNewsIndex = user.likedNews.findIndex(liked => liked.toString() === newsId);
    if(likedNewsIndex !== -1) {
      // throw new HttpException("Already liked", HttpStatus.BAD_REQUEST);
      news.likes--;
      user.likedNews.splice(likedNewsIndex, 1);
      await user.save();
      await news.save();
      return news;
    }

    const dislikedNewsIndex = user.dislikedNews.findIndex(disliked => disliked.toString() === newsId);
    if(dislikedNewsIndex !== -1) {
      user.dislikedNews.splice(dislikedNewsIndex);
      news.dislikes--;
    }

    news.likes++;

    const removedLikeIndex = user.removedLikedNews.findIndex(removedLike => removedLike.toString() === newsId);
    if(removedLikeIndex === -1) {
      const newCoeff = 1 / (new Date().getTime() - news.timePrevLike.getTime());
      const averageCoeff = (news.coeffLike * (news.likes - 1) + newCoeff) / news.likes;

      news.coeffLike = averageCoeff;
      news.timePrevLike = new Date();
    }

    user.likedNews.push(news);

    await news.save();
    await user.save();
    return news;
  }

  async dislikeNews(userId: string, newsId: string) {
    const user = await this.userModel.findById(userId);
    const news = await this.newsModel.findById(newsId);
    if(!news) throw new HttpException("News not found", HttpStatus.NOT_FOUND);

    const dislikedNewsIndex = user.dislikedNews.findIndex(disliked => disliked.toString() === newsId);
    if(dislikedNewsIndex !== -1) {
      // throw new HttpException("Already disliked", HttpStatus.BAD_REQUEST);
      news.dislikes--;
      user.dislikedNews.splice(dislikedNewsIndex, 1);
      await user.save();
      await news.save();
      return news;
    }

    const likedNewsIndex = user.likedNews.findIndex(liked => liked.toString() === newsId);
    if(likedNewsIndex !== -1) { // ignore next like (for real popularity coefficient)
      user.likedNews.splice(likedNewsIndex);
      user.removedLikedNews.push(news);
      news.likes--;
    }

    news.dislikes++;
    user.dislikedNews.push(news);
    await news.save();
    await user.save();
    return news;
  }

  async getNews(amount: number, asset = "", filters: any = {}, forIgnore: string[] = []) {
    const newPeriod = 605000000;
    // const oldPeriod = 1210000000;

    const matches: any = {};

    if(filters.period === "new") {
      matches.dateDifference = {$lte: newPeriod}
    } else if(filters.period === "old") {
      matches.dateDifference = {$gte: newPeriod}
    }

    if(filters.isCryptocurrency === true) {
      matches.AssetType = "Cryptocurrency";
    } else if(filters.isCryptocurrency === false) {
      matches.AssetType = { $ne: "Cryptocurrency" };
    }

    const news = await this.newsModel.aggregate([
      {$match: asset ? { currency: new mongoose.Types.ObjectId(asset) } : {} },
      {$addFields: {
        dateDifference: {$dateDiff: {
          startDate: "$time_published",
          endDate: new Date(),
          unit: "millisecond"
        }}
      }},
      {$match: {
        _id: {
          $nin: forIgnore.map(id => new mongoose.Types.ObjectId(id))
        },
        ...matches
      }},
      {$sort: {
        coeffLike: -1
      }},
      {$limit: amount},
    ])

    return news;
  }






}