import { Request, Response } from "express";
import { sendVerificationCode, signJWT } from "../utils";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const redis = new Redis();
export async function emailVerification(req: Request, res: Response) {
  try {
    const { email,type } = req.body;
    // also check in database that email is already exists or not
    if(type !== 'change_password'){
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }
    await sendVerificationCode(email);
    return res.status(200).json({
      success: "👍",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      messge: "Oops! Server error, try again later 👎",
    });
  }
}

export async function join(req: Request, res: Response) {
  try {
    const { agreedToTermsAndPolicy, code, password, ...userInfo } = req.body;
    const { email } = userInfo;
    const userCode = await redis.get(`code-${email}`);
    if (code !== userCode)
      return res.status(401).json({
        success: false,
        message: "Invalid code",
      });
    const user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    } else {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await prisma.user.create({
        data: {
          password: hashedPassword,
          ...userInfo,
        },
      });
      const token = await signJWT({
        id: newUser.id,
        email,
        name: newUser.firstName + " " + newUser.lastName,
      });
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
      });
    }
  } catch (error) {
    console.error("Error joining", error);
    return res.status(500).json({
      success: false,
      messge: "Oops! Server error, try again later 👎",
    });
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const isMatched = await bcrypt.compare(password, user.password);
      if (isMatched) {
        // send jwt token
        const token = await signJWT({
          id: user.id,
          email: user.email,
          name: user.firstName + " " + user.lastName,
        });
        return res.status(200).json({
          success: true,
          token,
        });
      }

      return res.status(401).json({
        success: true,
        message: "Credentials does not match",
      });
    }
  } catch (error) {
    console.error("Error joining", error);
    return res.status(500).json({
      success: false,
      messge: "Oops! Server error, try again later 👎",
    });
  }
}
