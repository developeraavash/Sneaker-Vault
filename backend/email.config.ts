import { google } from "googleapis";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const SENDER = process.env.SENDER;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const transportOptions: SMTPTransport.Options = {
  service: "gmail",
  auth: {
    type: "OAUTH2",
    user: SENDER,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  },
};

const transport = nodemailer.createTransport(transportOptions);
export default transport;
