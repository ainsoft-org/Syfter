import { Model } from "mongoose";
import { EmailConfirmationDocument } from "../EmailConfirmation.schema";

export async function clearEmailConfirmations(emailConfirmation: Model<EmailConfirmationDocument>) {
  const emailConfirmationLifeTime = Number(process.env.emailConfirmationLifetime);
  const now = new Date();

  const emailConfirmations: any = await emailConfirmation.find();

  emailConfirmations.forEach(confirmation => {
    const prevCodeDate = new Date(confirmation.createdAt);
    if(now.getTime() - prevCodeDate.getTime() >= emailConfirmationLifeTime) {
      confirmation.remove();
    }
  })

  return true;
}