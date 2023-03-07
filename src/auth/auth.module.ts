import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/user.schema";
import { MailingModule } from "../mailing/mailing.module";
import { Address, AddressSchema } from "../addresses/address.schema";
import { RegisteringUser, RegisteringUserSchema } from "./registeringUser.schema";
import { AtStrategy } from "./strategies/at.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Session, SessionSchema } from "../sessions/session.schema";
import { AuthingUser, AuthingUserSchema } from "./authingUser.schema";
import { TwitterStrategy } from "./strategies/twitter.strategy";
import { AlphavantageService } from "../alphavantage/alphavantage.service";
import { AlphavantageModule } from "../alphavantage/alphavantage.module";
import { CacheModule } from "@nestjs/common/cache";
import { RedisClientOptions } from "redis";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    MongooseModule.forFeature([{ name: RegisteringUser.name, schema: RegisteringUserSchema }]),
    MongooseModule.forFeature([{ name: AuthingUser.name, schema: AuthingUserSchema }]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MailingModule,
    JwtModule.register({}),
    AlphavantageModule,
    CacheModule.register<RedisClientOptions>({
      socket: {
        host: 'localhost',
        port: 6379
      }
    }),
  ],
  providers: [
    AuthService,
    AtStrategy,
    TwitterStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
