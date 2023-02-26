import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from  'passport-jwt'
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../user/user.schema";
import { Model } from "mongoose";
import { Session, SessionDocument } from "../../sessions/session.schema";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.access_secret
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub)
      .select('+pin -reactions -likedSectors -removedReactions');

    const session = await this.sessionModel.findById(payload.sessionId);

    if(!session) {
      throw new HttpException("Your session is closed", HttpStatus.UNAUTHORIZED);
    }

    session.lastActivity = new Date();
    user.lastActivity = new Date();

    await session.save();
    await user.save();

    return {...payload, user, session};
  }
}