import crypto from "crypto";
import transport from "../email.config";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../types";

dotenv.config();

const redis = new Redis();

function generateCode() {
  const code = crypto.randomInt(100000, 1000000);
  return code;
}

export async function sendVerificationCode(user: string) {
  try {
    const code = generateCode();
    // set expiration tme of 60 sec
    await redis.set(`code-${user}`, code, "EX", 120);
    const mailInfo = await transport.sendMail({
      from: "narenmagarz98@gmail.com",
      to: user,
      subject: "Verification Code",
      html: `<p>Your Verification Code: <b>${code}</b></p>`,
    });
    console.log(mailInfo);
  } catch (error) {
    console.error("Error sending verification code", error);
  }
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export function verifyJWT(token: string) {
  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  return decodedToken;
}

export async function signJWT(payload: {}) {
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d", // 3600 => 1 hr, 2d => 2 day, 1h => 1hour
  });
  return token;
}

function checkAuth(token: string) {}

export async function sendOrderVerificationEmail(
  cEmail: string,
  orderDetail: {},
) {
  try {
  } catch (error) {}
}
