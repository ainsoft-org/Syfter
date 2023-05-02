import { Body, Controller, Param, Post, Get } from "@nestjs/common";
import { MobileNumberDto } from "../auth/dto/MobileNumber.dto";
import { MailingService } from "./mailing.service";
import { CheckRegConfirmationCode } from "../auth/dto/Reg/CheckRegConfirmationCode.dto";
import { SetPinRegDto } from "../auth/dto/Reg/SetPinReg.dto";
import { SetUsernameRegDto } from "../auth/dto/Reg/SetUsernameRegDto.dto";
import { SetEmailRegDto } from "../auth/dto/Reg/SetEmailReg.dto";
import { SetAddressRegDto } from "../auth/dto/Reg/SetAddressReg.dto";

@Controller('mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('/sendEmailConfirmation/*')
  sendEmailConfirmation(@Param('0') id: string) {
    return this.mailingService.generateEmailConfirmation(id);
  }

  @Get('/emailConfirmation/*')
  confirmEmail(@Param('0') id: string) {
    return this.mailingService.confirmEmail(id);
  }



}
