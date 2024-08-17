import z from "zod";
import express from "express";
import { emailVerification, join, signin } from "../controllers";
import checkAuth from "../controllers/auth";
import { confirmOrder, makeOrder } from "../controllers/order";

const router = express.Router();

router.get('/test',(req,res)=>{
  return res.json("okay")
})
router.get("/auth", checkAuth);
router.post(
  "/email-verification",
  (req, res, next) => {
    try {
      z.object({
        email: z.string().email(),
      }).parse(req.body);
      next();
    } catch (error) {
      console.error("Error validating email");
      return res.status(409).json({
        success: false,
      });
    }
  },
  emailVerification,
);

router.post(
  "/join",
  (req, res, next) => {
    try {
      z.object({
        code: z.string().regex(/^[0-9]{6}$/),
        email: z.string().email(),
        firstName: z.string().regex(/^[A-z]{3,}$/),
        lastName: z.string().regex(/^[A-z]{2,}$/),
        password: z
          .string()
          .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        address: z.string(),
        dateOfBirth: z
          .string()
          .regex(/^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
        agreedToTermsAndPolicy: z.boolean(),
      }).parse(req.body);
      next();
    } catch (error) {
      console.error("Error validating email", error);
      return res.status(409).json({
        success: false,
      });
    }
  },
  join,
);

router.post(
  "/signin",
  (req, res, next) => {
    try {
      z.object({
        email: z.string().email(),
        password: z
          .string()
          .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-+<>])[A-Za-z\d@$!%*?&#-+<>]{8,}$/,
          ),
      }).parse(req.body);
      next();
    } catch (error) {
      console.error("Error signing", error);
      return res.status(409).json({
        success: false,
      });
    }
  },
  signin,
);

export default router;
