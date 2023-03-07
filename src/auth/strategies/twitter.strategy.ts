import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-twitter';
import { Injectable } from "@nestjs/common";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: "http://localhost:3000/auth/twitter/redirect" // process.env.host
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
  }
}