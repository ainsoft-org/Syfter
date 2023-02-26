import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { CacheModule } from "@nestjs/common/cache";
import { RedisClientOptions } from "redis";
import { MongooseModule } from "@nestjs/mongoose";
import { News, NewsSchema } from "./news.schema";
import { User, UserSchema } from "../user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register<RedisClientOptions>({
      socket: {
        host: 'localhost',
        port: 6379
      }
    }),
  ],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
