import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-twitter';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../user/user.schema";
import { Model } from "mongoose";
import { Session, SessionDocument } from "../../sessions/session.schema";
import { RegisteringUser, RegisteringUserDocument } from "../registeringUser.schema";
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from "../auth.service";
import * as process from "process";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(RegisteringUser.name) private regingUserModel: Model<RegisteringUserDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private authService: AuthService
  ) {

    super({
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: process.env.oauthRedirect // process.env.host
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const image = profile._json.profile_image_url;
    const twitterId = profile._json.id_str;
    const user = await this.userModel.findOne({ twitterId });
    if(user) {
      if(image) user.image = image;
      await user.save();
      return { data: await this.authService.sendAuthConfirmationCode("", twitterId), status: "auth" };
    }

    const regToken: string = uuidv4();
    const payload: any = {
      twitterId,
      regToken,
      stage: "PIN"
    };
    if(image) {
      payload.image = image;
    } else {
      payload.image = process.env.host + "/uploads/default_image.png";
    }
    const newRegisteringUser = new this.regingUserModel(payload);
    await newRegisteringUser.save();

    return {
      status: "reg",
      data: {
        regToken: newRegisteringUser.regToken
      }
    }
  }
}