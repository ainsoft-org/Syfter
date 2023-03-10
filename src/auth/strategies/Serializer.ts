import { PassportSerializer} from "@nestjs/passport";
import { InjectModel } from "@nestjs/mongoose";
import { RegisteringUser, RegisteringUserDocument } from "../registeringUser.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectModel(RegisteringUser.name) private regingUserModel: Model<RegisteringUserDocument>,
  ) {
    super();
  }

  serializeUser(user: any, done: any) {
    done(null, user)
  }

  async deserializeUser(payload: any, done: any) {
    return done(null, null);
  }
}