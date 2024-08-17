import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
const redis = new Redis();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
export async function initiatePayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionId = jwt.sign(
    {
      orderId: 1,
      userId: 1,
      email: "",
      totalAmount: 1200,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: 60,
    },
  );
  const paymentResponse = await fetch(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    {
      method: "POST",
      headers: {
        Authorization: `key live_secret_key_68791341fdd94846a146f0457ff7b455`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `http://localhost:3000/order-confirm/${sessionId}`,
        website_url: "http://localhost:3000",
        amount: "10000",
        purchase_order_id: "test12",
        purchase_order_name: "test",
        customer_info: {
          name: "ram bahadur",
          email: "test@khalti.com",
          phone: "9800000000",
        },
      }),
    },
  );
  const { payment_url: paymentUrl } = await paymentResponse.json();
  console.log(paymentUrl);
}
