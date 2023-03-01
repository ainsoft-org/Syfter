import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/user.schema";
import { Comment, CommentSchema } from "./comments.schema";
import { Currency, CurrencySchema } from "../alphavantage/currency.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
