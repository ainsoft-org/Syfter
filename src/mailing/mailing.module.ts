import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { RegisteringUser, RegisteringUserSchema } from "../auth/registeringUser.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { MailingController } from './mailing.controller';
import { User, UserSchema } from "../user/user.schema";
import { Address, AddressSchema } from "../addresses/address.schema";
import { EmailConfirmation, EmailConfirmationSchema } from "./EmailConfirmation.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: EmailConfirmation.name, schema: EmailConfirmationSchema }]),
  ],
  providers: [MailingService],
  controllers: [MailingController],
  exports: [MailingService]
})
export class MailingModule {}
