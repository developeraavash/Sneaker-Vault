import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { verifyJWT } from "../utils";

const prism = new PrismaClient();
export default async function checkAuth(req: Request, res: Response) {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split("Bearer")[1];
    if (token) {
      const payload = verifyJWT(token.trim()) as {
        id: number;
        name: string;
        email: string;
      };
      const user = await prism.user.findFirst({
        where: {
          id: payload.id,
          email: payload.email,
        },
      });
      if (user) {
        return res.status(200).json({
          success: true,
          user: {
            id: user.id,
            name: user.firstName,
            email: user.email,
          },
        });
      } else
        return res.status(401).json({
          success: false,
          message: "Unauthorized user",
        });
    } else
      return res.status(401).json({
        success: false,
      });
  } catch (error) {
    console.error("Error authenticating user", error);
    return res.status(500).json({message:'Internal server error'})
  }
}
