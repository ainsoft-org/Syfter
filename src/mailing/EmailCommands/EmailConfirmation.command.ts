import { SendEmailCommand } from "@aws-sdk/client-ses";

export const createEmailConfirmationCommand = (email: string, link: string) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [
        email
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
              Your email verification link for ${process.env.appName}:
              <a href="${link}">${link}</a>
            `,
        },
        // Text: {
        //   Charset: "UTF-8",
        //   Data: `Your email verification link for ${process.env.appName}:\n${link}`,
        // },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Email Confirmation - ${process.env.appName}`,
      },
    },
    Source: process.env.sender_emailAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};