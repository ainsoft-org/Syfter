import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Session, SessionDocument } from "./session.schema";
import { User, UserDocument } from "../user/user.schema";
import { deleteOutdatedSessions } from "./funcs/deleteOutdatedSessions";

import axios from "axios";
import * as csv from 'csvtojson';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    const now = new Date();
    const nextDay = new Date();
    nextDay.setDate(now.getDate() + 1); nextDay.setHours(0);
    nextDay.setMinutes(0); nextDay.setSeconds(0);

    deleteOutdatedSessions(sessionModel, userModel);
    setTimeout(() => {
      deleteOutdatedSessions(sessionModel, userModel);
      setInterval(() => {
        console.log("--cleared outdated sessions");
        deleteOutdatedSessions(sessionModel, userModel);
      }, 86400000); // every 1 day
    }, nextDay.getTime() - now.getTime());
  }

  async getSessions(userId: string) {
    const sessions = await this.sessionModel.find({ user: userId });
    return sessions;
  }

  async closeSession(sessionId: string, userId: string) {
    const session = await this.sessionModel.findById(sessionId);
    const user = await this.userModel.findById(session.user);
    if(userId !== user._id.toString()) throw new HttpException("Access denied", HttpStatus.FORBIDDEN);

    const sessionIndex = user.sessions.findIndex(sess => sess.toString() === sessionId);
    user.sessions.splice(sessionIndex, 1);

    await session.remove();
    await user.save();

    return { message: "Session removed" };
  }

  async closeAllSessions(currentSessionId: string, userId: string, pin: string) {
    const currentSession = await this.sessionModel.findById(currentSessionId);
    const user = await this.userModel.findById(currentSession.user).select("+pin");
    if(userId !== user._id.toString()) throw new HttpException("Access denied", HttpStatus.FORBIDDEN);

    if(pin !== user.pin) throw new HttpException("Incorrect pin code", HttpStatus.FORBIDDEN);

    user.sessions.forEach(async session => {
      const foundSession = await this.sessionModel.findById(session);
      if(foundSession && foundSession._id.toString() !== currentSessionId) {
        await foundSession.remove();
      }
    });

    user.sessions = [currentSession];
    await user.save();

    return { message: "Sessions closed" };
  }

  async setSessionExpirationPeriod(userId: string, period: string) {
    try {
      const user = await this.userModel.findById(userId);
      user.sessionTerminationTimeframe = period;
      await user.save();

      return period;
    } catch (err) {
      throw new HttpException('Error saving to DB', HttpStatus.BAD_REQUEST);
    }
  }
}
