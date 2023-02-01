import { Model } from "mongoose";
import { RegisteringUser, RegisteringUserDocument } from "../registeringUser.schema";
import * as dotenv from 'dotenv';
dotenv.config();

export async function clearRegisteringUsers(regingUserModel: Model<RegisteringUserDocument>) {
  const userUnconfirmedLifeTime = Number(process.env.registringUserLifetime);
  const now = new Date();

  const users = await regingUserModel.find();

  users.forEach(user => {
    const prevCodeDate = new Date(user.prevCodeTime);
    if(now.getTime() - prevCodeDate.getTime() >= userUnconfirmedLifeTime) {
      user.remove();
    }
  })

  return true;
}