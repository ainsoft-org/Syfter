import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
// import { AuthDto } from "./dto";
import { countries } from "./countries";
// import { MailingService } from "../mailing/mailing.service";
import { RegisteringUser, RegisteringUserDocument } from "./registeringUser.schema";
import { Address, AddressDocument } from "../addresses/address.schema";
import { clearRegisteringUsers } from "./providers/clearRegisteringUsers.provider";
import { MobileNumberDto } from "./dto/MobileNumber.dto";
import { parsePhone } from "./providers/phoneNumber.provider";
import { randomNumberCode } from "./providers/randomNumberCode";
import { CheckRegConfirmationCode } from "./dto/Reg/CheckRegConfirmationCode.dto";
import { SetPinRegDto } from "./dto/Reg/SetPinReg.dto";
import { SetUsernameRegDto } from "./dto/Reg/SetUsernameRegDto.dto";
import { SetEmailRegDto } from "./dto/Reg/SetEmailReg.dto";
import { SetAddressRegDto } from "./dto/Reg/SetAddressReg.dto";
import { JwtService } from "@nestjs/jwt";
// import { hashData, compareData} from "../common/bcrypt";
import { Session, SessionDocument } from "../sessions/session.schema";
import { AuthingUser, AuthingUserDocument } from "./authingUser.schema";
import { SignInLocalDto } from "./dto/SignInLocal.dto";
import { clearAuthingUsers } from "./providers/clearAuthingUsers.provider";
import { MailingService } from "../mailing/mailing.service";
import { AlphavantageService } from "../alphavantage/alphavantage.service";
import { lookup as lookupIP } from 'geoip-lite';
import { RestoringPinUser, RestoringPinUserDocument } from "./restoringPinUser.schema";
import { clearRestoringPinUsers } from "./providers/clearRestoringPinUsers.provider";
import { RestorePinDto } from "./dto/restorePin.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RegisteringUser.name) private regingUserModel: Model<RegisteringUserDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(AuthingUser.name) private authingUserModel: Model<AuthingUserDocument>,
    private jwtService: JwtService,
    private mailingService: MailingService,
    private alphaVantageService: AlphavantageService,
    @InjectModel(RestoringPinUser.name) private RestoringPinUserModel: Model<RestoringPinUserDocument>,
  ) {
    const clearRegisteringUsersEvery =  Number(process.env.clearRegisteringUsersEvery);
    setInterval(async () => {
      if(await clearRegisteringUsers(regingUserModel)) {
        console.log(`--cleared some actively registering users after specified time --${new Date()}`);
      }
      if(await clearAuthingUsers(authingUserModel)) {
        console.log(`--cleared some actively authing users after specified time --${new Date()}`);
      }
      if(await clearRestoringPinUsers(RestoringPinUserModel)) {
        console.log(`--cleared some actively restoring pin users after specified time --${new Date()}`);
      }
    }, clearRegisteringUsersEvery);
  }

  getCountries() {
    return countries;
  }

  private async getTokens(params: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(params, {
        secret: process.env.access_secret,
        expiresIn: Number(process.env.access_expires)
      }),
      this.jwtService.signAsync(params, {
        secret: process.env.refresh_secret,
        expiresIn: Number(process.env.refresh_expires)
      })
    ]);

    return {
      refresh_token: rt,
      access_token: at
    }
  }

  private async generateAt (params: any) {
    return await this.jwtService.signAsync(params, {
        secret: process.env.access_secret,
        expiresIn: Number(process.env.access_expires)
      }
    );
  }

  private getCountry(ip) {
    const country = lookupIP(ip)?.country;
    return country || "unknown";
  }

  async signinLocal(dto: SignInLocalDto, ip: string) {
    const foundAuthingUser = await this.authingUserModel.findOne({ authToken: dto.authToken });

    if(!foundAuthingUser) {
      throw new HttpException('Authing user not found by this authToken', HttpStatus.NOT_FOUND);
    }

    const foundUser = await this.userModel.findById(foundAuthingUser.userID)
      .select("+pin +sessions +email");

    if(dto.pin !== foundUser.pin) { // need to compare
      throw new HttpException('PIN is not correct', HttpStatus.FORBIDDEN);
    }

    const foundSession = await this.sessionModel.findOne({ deviceID: dto.deviceID });
    if(foundSession) {
      const foundSessionUser = await this.userModel.findById(foundSession.user).select("+sessions");
      if(foundSessionUser) {
        const sessionIndex = foundSessionUser.sessions.findIndex(sessionsId => sessionsId.toString() === foundSession._id.toString());
        if(sessionIndex !== -1) {
          foundSessionUser.sessions.splice(sessionIndex, 1);
          await foundSessionUser.save();
        }
      }
      await foundSession.remove();
    }

    try {
      const newSession = new this.sessionModel({
        device: dto.device,
        country: this.getCountry(ip),
        deviceID: dto.deviceID,
        user: foundUser
      });
      const tokens = await this.getTokens({
        roles: foundUser.roles,
        sub: foundUser._id,
        sessionId: newSession._id.toString()
      });
      newSession.refreshToken = tokens.refresh_token;

      foundUser.sessions.push(newSession);

      await newSession.save();
      await foundUser.save();
      await foundAuthingUser.remove();

      return { ...tokens, username: foundUser.username, email: foundUser.email, image: foundUser.image || process.env.host + "/uploads/default_image.png" };
    } catch (err) {
      throw new HttpException(`Error: ${err}`, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(userId: string, refreshToken: string) {
    const foundUser = await this.userModel.findById(userId).select("+sessions");
    if(!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const foundSession = await this.sessionModel.findOne({
      refreshToken: refreshToken,
      user: userId
    });
    if(!foundSession) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    const sessionIndex = foundUser.sessions.findIndex(sessionId => sessionId.toString() === foundSession._id.toString());
    if(sessionIndex === -1) {
      throw new HttpException('Session not found in user`s sessions array', HttpStatus.BAD_REQUEST);
    }

    foundUser.sessions.splice(sessionIndex, 1);

    await foundUser.save();
    await foundSession.remove();

    return foundSession
  }

  async refreshToken(refreshToken: string) {
    const foundSession = await this.sessionModel.findOne({ refreshToken });
    if(!foundSession) throw new HttpException("Your session is closed", HttpStatus.UNAUTHORIZED);

    const foundUser = await this.userModel.findById(foundSession.user).select("+sessions");
    let data: any;
    try {
      data = await this.jwtService.verifyAsync(refreshToken, { publicKey: process.env.refresh_secret });
    } catch (err) {
      const sessionIndex = foundUser.sessions.findIndex(sessionsId => sessionsId.toString() === foundSession._id.toString());
      if(sessionIndex !== -1) {
        foundUser.sessions.splice(sessionIndex, 1);
        await foundUser.save();
      }
      await foundSession.remove();
      throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }

    const newAccessToken = await this.generateAt({
      roles: foundUser.roles,
      sub: foundUser._id,
      sessionId: foundSession._id.toString()
    });

    return { access_token: newAccessToken }
  }


  async restorePin(mobileNumber) {
    let formattedPhone: any;
    try {
      formattedPhone = parsePhone(mobileNumber).formatInternational();
    } catch (err) {}

    let foundUser;
    if(formattedPhone) {
      foundUser = await this.userModel.findOne({ mobileNumber: formattedPhone }).select("_id");
    }
    if(!foundUser) {
      throw new HttpException('Account is not registered', HttpStatus.FORBIDDEN);
    }

    let foundRestoringPinUser = await this.RestoringPinUserModel.findOne({ userID: foundUser._id.toString() });

    if(!foundRestoringPinUser) {
      const confirmationCode = randomNumberCode(5);
      foundRestoringPinUser = new this.RestoringPinUserModel({
        userID: foundUser._id.toString(),
        verificationCode: confirmationCode,
        restoreToken: uuidv4()
      });

      await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);
      await foundRestoringPinUser.save();

      const foundRestoringPinUserObject = foundRestoringPinUser.toObject();
      delete foundRestoringPinUserObject.verificationCode;

      return foundRestoringPinUserObject;
    }

    if(foundRestoringPinUser.sentConfirmations >= 3) {
      throw new HttpException('Too many attempts. Please try again in a hour', HttpStatus.FORBIDDEN);
    }

    const confirmationCode = randomNumberCode(5);
    foundRestoringPinUser.verificationCode = confirmationCode;
    foundRestoringPinUser.sentConfirmations++;
    foundRestoringPinUser.prevCodeTime = new Date();
    await foundRestoringPinUser.save();

    await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);

    const foundRestoringPinUserObject = foundRestoringPinUser.toObject();
    delete foundRestoringPinUserObject.verificationCode;

    return foundRestoringPinUserObject;
  }

  async confirmRestorePin(restoreToken: string, code: string) {
    const foundRestoringPinUser = await this.RestoringPinUserModel.findOne({ restoreToken }).select("+verificationCode");
    if(!foundRestoringPinUser) {
      throw new HttpException("Restoring pin session is not found. Try again", HttpStatus.NOT_FOUND);
    }

    if(foundRestoringPinUser.verificationCode !== code) {
      throw new HttpException("Incorrect confirmation code", HttpStatus.BAD_REQUEST);
    }

    foundRestoringPinUser.confirmed = true;
    await foundRestoringPinUser.save();

    return foundRestoringPinUser;
  }

  async restorePin2(dto: RestorePinDto) {
    const foundRestoringPinUser = await this.RestoringPinUserModel.findOne({ restoreToken: dto.restoreToken });
    if(!foundRestoringPinUser) {
      throw new HttpException("Restoring pin session is not found. Try again", HttpStatus.NOT_FOUND);
    }

    if(!foundRestoringPinUser.confirmed) {
      throw new HttpException("PIN restore request has not yet been confirmed", HttpStatus.NOT_FOUND);
    }

    const user = await this.userModel.findById(foundRestoringPinUser.userID);
    user.pin = dto.pin;

    await user.save();
    return { message: "PIN restored" }
  }



  async sendAuthConfirmationCode(mobileNumber, twitterId = "") {
    let formattedPhone: any = null;
    try {
      formattedPhone = parsePhone(mobileNumber).formatInternational();
    } catch (err) {}

    let foundUser;
    if(formattedPhone) {
      foundUser = await this.userModel.findOne({ mobileNumber: formattedPhone }).select("_id");
    } else if(twitterId) {
      foundUser = await this.userModel.findOne({ twitterId }).select("_id");
    }
    if(!foundUser) {
      throw new HttpException('Account is not registered', HttpStatus.FORBIDDEN);
    }

    const foundAuthingUser = await this.authingUserModel.findOne({ userID: foundUser._id });
    if(!foundAuthingUser) {
      const authToken: string = uuidv4();
      try {
        const newAuthingUser = new this.authingUserModel({
          userID: foundUser._id,
          authToken
        });
        await newAuthingUser.save();

        return {
          message: `Authing process started`,
          authToken
        }
      } catch (err) {
        console.log(err)
        throw new HttpException('Error saving new authing user', HttpStatus.BAD_REQUEST);
      }
    }

    return {
      message: `Authing process is still active`,
      authToken: foundAuthingUser.authToken
    }

  }

  // Registration endpoints
  async sendRegConfirmationCode(mobileNumber: MobileNumberDto) {
    const formattedPhone = parsePhone(mobileNumber.number).formatInternational();

    const foundUserByPhoneNumber = await this.userModel.findOne({ mobileNumber: formattedPhone });
    if(foundUserByPhoneNumber) {
      throw new HttpException('This phone number already registered', HttpStatus.BAD_REQUEST);
    }

    const foundRegingUser = await this.regingUserModel.findOne({ mobileNumber: formattedPhone });

    if(!foundRegingUser) {
      const confirmationCode: string = randomNumberCode(5);
      const regToken: string = uuidv4();
      try {
        const newRegingUser = new this.regingUserModel({
          verificationCode: confirmationCode,
          mobileNumber: formattedPhone,
          regToken
        });
        await newRegingUser.save();
        await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);

        const newRegingUserObject = newRegingUser.toObject();
        delete newRegingUserObject.verificationCode;

        return {
          message: `Confirmation code sent to number: ${formattedPhone}`,
          data:  newRegingUserObject
        }
      } catch (err) {
        console.log(err)
        throw new HttpException('Error saving new registering user', HttpStatus.BAD_REQUEST);
      }
    }

    if(foundRegingUser.sentConfirmations >= 3) {
      throw new HttpException('Too many attempts. Please try again in a hour', HttpStatus.FORBIDDEN);
    }

    const confirmationCode: string = randomNumberCode(5);
    foundRegingUser.verificationCode = confirmationCode;
    foundRegingUser.sentConfirmations++;
    foundRegingUser.prevCodeTime = new Date();
    await foundRegingUser.save();
    await this.mailingService.generateSMSConfirmation(formattedPhone, confirmationCode);

    const foundRegingUserObject = foundRegingUser.toObject();
    delete foundRegingUserObject.verificationCode;

    return {
      message: `Confirmation code resent to number: ${formattedPhone}`,
      data: foundRegingUserObject
    }
  }

  async checkRegConfirmationCode(dto: CheckRegConfirmationCode) {
    const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken }).select('+verificationCode');
    if(!foundRegingUser) {
      throw new HttpException('Reging user not found by this regToken', HttpStatus.NOT_FOUND);
    }

    if(foundRegingUser.stage !== "SMS") {
      throw new HttpException('Error stage for this endpoint', HttpStatus.BAD_REQUEST);
    }

    if(dto.code !== foundRegingUser.verificationCode) {
      throw new HttpException('Entered code is incorrect', HttpStatus.BAD_REQUEST);
    }

    foundRegingUser.stage = "PIN";
    await foundRegingUser.save();

    const foundRegingUserObj = foundRegingUser.toObject();
    delete foundRegingUserObj.verificationCode;

    return foundRegingUserObj;
  }

  async setPinReg(dto: SetPinRegDto) {
    const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken })
    if(!foundRegingUser) {
      throw new HttpException('Reging user not found by this regToken', HttpStatus.NOT_FOUND);
    }

    if(foundRegingUser.stage !== "PIN") {
      throw new HttpException('Error stage for this endpoint', HttpStatus.BAD_REQUEST);
    }

    foundRegingUser.pin = dto.pin;
    foundRegingUser.stage = "USERNAME";

    return await foundRegingUser.save();
  }

  async setUsernameReg(dto: SetUsernameRegDto) {
    const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken })
    if(!foundRegingUser) {
      throw new HttpException('Reging user not found by this regToken', HttpStatus.NOT_FOUND);
    }

    if(foundRegingUser.stage !== "USERNAME") {
      throw new HttpException('Error stage for this endpoint', HttpStatus.BAD_REQUEST);
    }

    foundRegingUser.username = dto.username;
    foundRegingUser.stage = "EMAIL";
    return await foundRegingUser.save();
  }

  async setEmailReg(dto: SetEmailRegDto) {
    const foundByEmail = await this.userModel.findOne({ email: dto.email, emailConfirmed: true });
    if(foundByEmail) {
      throw new HttpException('This email is already taken', HttpStatus.BAD_REQUEST);
    }

    const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken })
    if(!foundRegingUser) {
      throw new HttpException('Reging user not found by this regToken', HttpStatus.NOT_FOUND);
    }

    if(foundRegingUser.stage !== "EMAIL") {
      throw new HttpException('Error stage for this endpoint', HttpStatus.BAD_REQUEST);
    }

    foundRegingUser.email = dto.email;
    foundRegingUser.acceptNotifications = dto.acceptNotifications;
    foundRegingUser.stage = "ADDRESS";
    return await foundRegingUser.save();
  }

  async setAddressReg(dto: SetAddressRegDto, ip: string) {
    const foundRegingUser = await this.regingUserModel.findOne({ regToken: dto.regToken })
      .select("+pin +mobileNumber +username +email +acceptNotifications");
    if(!foundRegingUser) {
      throw new HttpException('Reging user not found by this regToken', HttpStatus.NOT_FOUND);
    }

    if(foundRegingUser.stage !== "ADDRESS") {
      throw new HttpException('Error stage for this endpoint', HttpStatus.BAD_REQUEST);
    }

    try {
      const newAddress = new this.addressModel({ // need to validate address and network
        network: process.env.networkForFreeTokens,
        content: dto.address
      });

      const payload: any = {
        mobileNumber: foundRegingUser.mobileNumber,
        pin: foundRegingUser.pin,
        username: foundRegingUser.username,
        email: foundRegingUser.email,
        acceptNotifications: foundRegingUser.acceptNotifications,
        twitterId: foundRegingUser.twitterId
      }
      payload.image = foundRegingUser.image || process.env.host + "/uploads/default_image.png";
      const newUser = new this.userModel(payload);

      const foundSession = await this.sessionModel.findOne({ deviceID: dto.deviceID });
      if(foundSession) {
        const foundSessionUser = await this.userModel.findById(foundSession.user).select("+sessions");
        if(foundSessionUser) {
          const sessionIndex = foundSessionUser.sessions.findIndex(sessionsId => sessionsId.toString() === foundSession._id.toString());
          if(sessionIndex !== -1) {
            foundSessionUser.sessions.splice(sessionIndex, 1);
            await foundSessionUser.save();
          }
        }
        await foundSession.remove();
      }

      const newSession = new this.sessionModel({
        device: dto.device,
        country: this.getCountry(ip),
        deviceID: dto.deviceID,
        user: newUser
      });
      const tokens = await this.getTokens({
        roles: newUser.roles,
        sub: newUser._id,
        sessionId: newSession._id.toString()
      });
      newSession.refreshToken = tokens.refresh_token;

      try {
        await this.mailingService.generateEmailConfirmation(newUser);
      } catch (err) {
        console.log(err);
      }

      newAddress.user = newUser;
      newUser.addresses.push(newAddress);
      newUser.sessions.push(newSession);

      await newUser.save();
      await newAddress.save();
      await newSession.save();
      await foundRegingUser.remove();

      return { ...tokens, username: newUser.username, email: newUser.email, image: newUser.image };
    } catch (err) {
      console.log(err)
      throw new HttpException({message: "Something went wrong. Please try later"}, HttpStatus.BAD_REQUEST);
    }
  }

}
