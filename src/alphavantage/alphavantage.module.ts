import { Module } from '@nestjs/common';
import { AlphavantageController } from './alphavantage.controller';
import { AlphavantageService } from './alphavantage.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Currency, CurrencySchema } from "./currency.schema";
import { News, NewsSchema } from "../news/news.schema";
import { CurrentStat, CurrentStatSchema } from "./currentStat.schema";
import { User, UserSchema } from "../user/user.schema";
import { CacheModule } from '@nestjs/common/cache';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }]),
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    MongooseModule.forFeature([{ name: CurrentStat.name, schema: CurrentStatSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register<RedisClientOptions>({
      socket: {
        host: 'localhost',
        port: 6379
      }
    }),
  ],
  controllers: [AlphavantageController],
  providers: [AlphavantageService],
  exports: [AlphavantageService]
})
export class AlphavantageModule {}
