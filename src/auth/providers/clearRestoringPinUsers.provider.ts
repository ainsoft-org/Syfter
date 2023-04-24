import { Model } from "mongoose";
import * as dotenv from 'dotenv';
import { RestoringPinUserDocument } from "../restoringPinUser.schema";
dotenv.config();

export async function clearRestoringPinUsers(restoringPinUserModel: Model<RestoringPinUserDocument>) {
  const userUnconfirmedLifeTime = Number(process.env.registringUserLifetime);
  const now = new Date();

  const users: any = await restoringPinUserModel.find();

  users.forEach(user => {
    const prevCodeDate = new Date(user.createdAt);
    if(now.getTime() - prevCodeDate.getTime() >= userUnconfirmedLifeTime) {
      user.remove();
    }
  })

  return true;
}