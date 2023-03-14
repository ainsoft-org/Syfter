import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import  {  SESClient }  from  "@aws-sdk/client-ses" ;
import { SNSClient, SetSMSAttributesCommand, PublishCommand } from "@aws-sdk/client-sns";
import { InjectModel } from "@nestjs/mongoose";
import { EmailConfirmation, EmailConfirmationDocument } from "./EmailConfirmation.schema";
import { User, UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
import { createEmailConfirmationCommand } from "./EmailCommands/EmailConfirmation.command";
import { clearEmailConfirmations } from "./providers/clearEmailConfirmations";

@Injectable()
export class MailingService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(EmailConfirmation.name) private emailConfirmationModel: Model<EmailConfirmationDocument>,
  ) {
    const clearEmailConfirmationsEvery =  Number(process.env.clearEmailConfirmationsEvery);
    setInterval(async () => {
      if(await clearEmailConfirmations(emailConfirmationModel)) {
        console.log(`--cleared email confirmations after specified time (.env)--${new Date()}`);
      }
    }, clearEmailConfirmationsEvery);

    this.generateSMSConfirmation("+380963739436");
  }

  private clientSES = new SESClient({ region: "eu-central-1" });
  private clientSNS = new SNSClient({ region: "eu-central-1" });

  async generateEmailConfirmation(user: User) {
    try {
      const newEmailConfirmation = new this.emailConfirmationModel({ user });

      const sendEmailCommand = createEmailConfirmationCommand(
        user.email,
        `${process.env.host}/mailing/emailConfirmation/${newEmailConfirmation._id.toString()}`
      );

      await this.clientSES.send(sendEmailCommand);
      await newEmailConfirmation.save();
    } catch (err) {
      throw new HttpException('Error sending email confirmation list', HttpStatus.BAD_REQUEST);
    }
  }

  async confirmEmail(emailConfirmationId: string) {
    try {
      const foundEmailConfirmation = await this.emailConfirmationModel.findById(emailConfirmationId);
      if(!foundEmailConfirmation) throw new HttpException("Link doesn't currently", HttpStatus.BAD_REQUEST);

      const user = await this.userModel.findById(foundEmailConfirmation.user);
      if(!user) throw new HttpException("User not found for this link", HttpStatus.BAD_REQUEST);

      user.emailConfirmed = true;
      await user.save();
      await foundEmailConfirmation.remove();
    } catch (err) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    return "Confirmed";
  }

  async generateSMSConfirmation(number: string) {
    const setAttributesCommand = new SetSMSAttributesCommand({
      attributes: {
        DefaultSenderID: "Syfter",
        DefaultSMSType: "Transactional"
      },
    });

    const publishCommand = new PublishCommand({
      Message: "Test code sdsdg",
      PhoneNumber: number
    });

    // const res1 = await this.clientSNS.send(setAttributesCommand);
    const res2 = await this.clientSNS.send(publishCommand);

    // console.log(res1, res2)
    // console.log(res1)
  }



}
