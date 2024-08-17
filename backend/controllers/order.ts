import { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { esewaPayment, khaltiPayment } from "../utils/payment";
import Redis from "ioredis";
dotenv.config();
const prisma = new PrismaClient();
const redis = new Redis();
const LIVE_SECRET_KEY = "68791341fdd94846a146f0457ff7b455";
export async function makeOrder(req: Request, res: Response) {
  try {
    const { sessionId, paymentOption } = req.body;
    // first check if user id and id from session id are matched
    const value = await redis.get(`checkout-products-${sessionId}`);
    if (value) {
      const products = JSON.parse(value);
      const productsId = products.map(
        (product: { id: number; quantity: number }) => product.id,
      );
      const purchasedProducts = await prisma.product.findMany({
        where: {
          id: {
            in: productsId,
          },
        },
        select: {
          id: true,
          price: true,
          name: true,
        },
      });
      // console.log(purchasedProducts)
      let total = 320;
      const updatedProducts = purchasedProducts.map((product) => {
        const quantity = products.find(
          (p: { id: number; quantity: number }) => p.id === product.id,
        ).quantity;
        total += product.price * quantity;
        return {
          id: product.id,
          price: product.price,
          quantity,
        };
      });
      // fetch products name,quantity and price
      // create an order
      // finally send to the khalti merchant

      const newOrder = await prisma.order.create({
        data: {
          userId: 4,
          total,
          status: "Pending",
        },
      });
      const orderId = newOrder.id;
      for (let { id, quantity, price } of updatedProducts) {
        await prisma.orderItem.create({
          data: {
            orderId,
            productId: id,
            quantity,
            price,
          },
        });
      }
      // for khalti
      if (paymentOption === "khalti") {
        const paymentUrl = await khaltiPayment({
          email: "narenmagarz98@gmail.com",
          orderId,
          totalAmount: total,
          userId: 4,
        });
        if (!paymentUrl) {
          return res.status(500).json({
            success: false,
          });
        }
        return res.status(200).json({
          success: true,
          paymentUrl,
        });
      }
      // for esewa
      else {
        const paymentMetaData = await esewaPayment(
          {
            amount: total,
            deliveryFee: 320,
            serviceCharge: 0,
            taxFee: 0,
          },
          {
            userId: 4,
            orderId,
            email: "narenmagarz98@gmail.com",
          },
        );
        return res.status(200).json({
          success: true,
          paymentMetaData,
        });
      }
    } else {
      return res.status(409).json({
        success: false,
      });
    }
  } catch (err) {
    console.error("Error making order", err);
    return res.status(500).json({
      status: false,
      message: "Oops, Server error",
    });
  }
}

export async function confirmOrder(req: Request, res: Response) {
  try {
  } catch (err) {
    console.error("Error confirming order", err);
  }
}
