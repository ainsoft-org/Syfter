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
import { AlphavantageModule } from "../alphavantage/alphavantage.module";
import { SessionSerializer } from "./strategies/Serializer";
import { RestoringPinUser, RestoringPinUserSchema } from "./restoringPinUser.schema";

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
    MongooseModule.forFeature([{ name: RestoringPinUser.name, schema: RestoringPinUserSchema }])
  ],
  providers: [
    AuthService,
    AtStrategy,
    TwitterStrategy,
    SessionSerializer
  ],
  controllers: [AuthController]
})
export class AuthModule {}
