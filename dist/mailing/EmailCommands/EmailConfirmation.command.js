"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailConfirmationCommand = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const createEmailConfirmationCommand = (email, link) => {
    return new client_ses_1.SendEmailCommand({
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
            },
            Subject: {
                Charset: "UTF-8",
                Data: `Email Confirmation - ${process.env.appName}`,
            },
        },
        Source: process.env.sender_emailAddress,
        ReplyToAddresses: [],
    });
};
exports.createEmailConfirmationCommand = createEmailConfirmationCommand;
//# sourceMappingURL=EmailConfirmation.command.js.map