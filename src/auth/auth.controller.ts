import { Body, Controller, Post, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from './auth.service';
import { MobileNumberDto } from "./dto/MobileNumber.dto";
import { CheckRegConfirmationCode } from "./dto/Reg/CheckRegConfirmationCode.dto";
import { SetPinRegDto } from "./dto/Reg/SetPinReg.dto";
import { SetUsernameRegDto } from "./dto/Reg/SetUsernameRegDto.dto";
import { SetEmailRegDto } from "./dto/Reg/SetEmailReg.dto";
import { SetAddressRegDto } from "./dto/Reg/SetAddressReg.dto";
import { SignInLocalDto } from "./dto/SignInLocal.dto";
import { AuthGuard } from "@nestjs/passport";
import { RefreshTokenDto } from "./dto/RefreshToken.dto";
import { TwitterAuthGuard } from "./strategies/TwitterAuth.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/getCountries')
  getCountries() {
    return this.authService.getCountries();
  }


  @UseGuards(TwitterAuthGuard)
  @Get('/twitter/signin')
  twitterSignin() {

    return "yes";
  }

  @UseGuards(TwitterAuthGuard)
  @Get('/twitter/redirect')
  twitterRedirect() {
    return "redirect"
  }




  // @Post('/local/signup')
  // signupLocal(@Body() dto) {
  //   this.authService.signupLocal();
  // }

  @Post('/sendAuthConfirmationCode')
  sendAuthConfirmationCode(@Body() dto: MobileNumberDto) {
    return this.authService.sendAuthConfirmationCode(dto)
  }

  // @UseGuards(AuthGuard())
  @Post('/local/signin')
  signinLocal(@Body() dto: SignInLocalDto) {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/local/logout')
  logout(@Request() req, @Body() dto: RefreshTokenDto) {
    return this.authService.logout(req.user.sub, dto.refreshToken);
  }

  // @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refreshToken')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }


  @Post('/sendRegConfirmationCode')
  sendRegConfirmationCode(@Body() mobileNumber: MobileNumberDto) {
    return this.authService.sendRegConfirmationCode(mobileNumber, mobileNumber?.flag);
  }

  @Post('/checkRegConfirmationCode')
  checkRegConfirmationCode(@Body() dto: CheckRegConfirmationCode) {
    return this.authService.checkRegConfirmationCode(dto, dto?.flag)
  }

  @Post('/setPinReg')
  setPinReg(@Body() dto: SetPinRegDto) {
    return this.authService.setPinReg(dto, dto?.flag);
  }

  @Post('/setUsernameReg')
  setUsernameReg(@Body() dto: SetUsernameRegDto) {
    return this.authService.setUsernameReg(dto, dto?.flag);
  }

  @Post('/setEmailReg')
  setEmailReg(@Body() dto: SetEmailRegDto) {
    return this.authService.setEmailReg(dto, dto?.flag);
  }

  @Post('/setAddressReg')
  setAddressReg(@Body() dto: SetAddressRegDto) {
    return this.authService.setAddressReg(dto, dto?.flag);
  }
}
