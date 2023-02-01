import { Model } from "mongoose";
import { AuthingUserDocument } from "../authingUser.schema";
import * as dotenv from 'dotenv';
dotenv.config();

export async function clearAuthingUsers(authingUserModel: Model<AuthingUserDocument>) {
  const userUnconfirmedLifeTime = Number(process.env.registringUserLifetime);
  const now = new Date();

  const users = await authingUserModel.find();

  users.forEach(user => {
    const prevCodeDate = new Date(user.prevCodeTime);
    if(now.getTime() - prevCodeDate.getTime() >= userUnconfirmedLifeTime) {
      user.remove();
    }
  })

  return true;
}