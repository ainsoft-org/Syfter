import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AddressesModule } from './addresses/addresses.module';
import { MailingModule } from './mailing/mailing.module';
import { SessionsModule } from './sessions/sessions.module';
import { AlphavantageModule } from './alphavantage/alphavantage.module';
import { NewsModule } from './news/news.module';
import { CommentsModule } from './comments/comments.module';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    // MongooseModule.forRoot(process.env.mongoDB),
    AuthModule,
    DbModule,
    UserModule,
    AddressesModule,
    MailingModule,
    SessionsModule,
    AlphavantageModule,
    NewsModule,
    CommentsModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
