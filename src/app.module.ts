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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongoDB:27017/Syfter'),
    // MongooseModule.forRoot("mongodb+srv://syfter:nFrE1TnBgtyJeLmd@cluster0.8fgzrra.mongodb.net/?retryWrites=true&w=majority"),
    AuthModule,
    DbModule,
    UserModule,
    AddressesModule,
    MailingModule,
    SessionsModule,
    AlphavantageModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
