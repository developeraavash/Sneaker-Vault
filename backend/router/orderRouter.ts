import express from "express";
import { confirmOrder, makeOrder } from "../controllers/order";
import z from "zod";
const router = express.Router();
router.post(
  "/create",
  (req, res, next) => {
    try {
      z.object({
        sessionId: z.string(),
        paymentOption: z.enum(["khalti", "esewa"]),
      }).parse(req.body);
      next();
    } catch (err) {
      console.error("Error validating order", err);
      return res.status(409).json({
        success: false,
      });
    }
  },
  makeOrder,
);

router.post("/confirm", confirmOrder);
export default router;
