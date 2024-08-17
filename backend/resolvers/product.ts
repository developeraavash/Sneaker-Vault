import { PrismaClient } from "@prisma/client";
import { sendVerificationCode, verifyJWT } from "../utils";
import bcrypt from "bcryptjs";
import { User } from "../types";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
const redis = new Redis();
const prisma = new PrismaClient();

const productResolvers = {
  Query: {
    getProducts: async (_: any, args: { first: number; after: string }) => {
      const take = args.first || 8;
      const cursor = args.after
        ? { id: parseInt(args.after) }
        : {
            id: 1,
          };
      const results = await prisma.product.findMany({
        ...(cursor && {
          skip: 1,
          cursor,
        }),
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          url: true,
          stock: true,
          images: {
            where: { url: { contains: "p1" } },
            take: 1,
          },
        },
        take,
      });
      if (results.length === 0) {
        return {
          products: [],
          metaData: {
            lastCursor: null,
            hasNextPage: false,
          },
        };
      }
      const cursorValue = results[results.length - 1].id;
      const nextPage = await prisma.product.findMany({
        skip: 1,
        cursor: {
          id: cursorValue,
        },
        take,
      });
      return {
        products: [...results],
        metaData: {
          lastCursor: cursorValue,
          hasNextPage: nextPage.length > 0,
        },
      };
    },
    getProduct: async (_: any, args: { id: number }) => {
      return await prisma.product.findFirst({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          stock: true,
          images: true,
        },
      });
    },
    searchProduct: async (_: any, args: { keyword: string }) => {
      return await prisma.product.findMany({
        where: {
          name: {
            contains: args.keyword,
          },
        },
        select: {
          id: true,
          name: true,
          images: {
            where: { url: { contains: "p1" } },
          },
          url: true,
        },
      });
    },
    getFeaturedProducts: async () => {
      return await prisma.product.findMany({
        take: 10,
        select: {
          id: true,
          price: true,
          url: true,
          name: true,
          images: {
            where: { url: { contains: "p1" } },
          },
        },
      });
    },
    getCartItems: async (_: any, __: any, ctx: any) => {
      const user = ctx.user;
      const items = await prisma.cart.findMany({
        where: {
          userId: user.id,
        },
        include: {
          product: {
            include: {
              images: {
                where: { url: { contains: "p1" } },
              },
            },
          },
        },
      });
      return items;
    },
    getCartValue: async (_: any, __: any, ctx: any) => {
      const user = ctx.user;
      const result = await prisma.cart.aggregate({
        _sum: {
          quantity: true,
        },
        where: { userId: user.id },
      });
      return result._sum.quantity;
    },
    getCheckoutUrl: async (
      _: any,
      args: {
        products: { id: string; quantity: number }[];
      },
      ctx: any,
    ) => {
      const user = ctx.user;
      const checkoutToken = uuidv4();
      const url = `${user.id}-${checkoutToken}`;
      console.log(url, "sesion url");
      await redis.set(
        `checkout-products-${url}`,
        JSON.stringify(args.products),
        "EX",
        180,
      );
      return `http://localhost:3000/checkout/${url}`;
    },
    getCheckoutForm: async (_: any, __: { sessionId: string }, ctx: any) => {
      const user = ctx.user;
      return await prisma.checkoutSession.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              address: true,
            },
          },
        },
      });
    },
    getOrderSummary: async (
      _: any,
      { sessionId }: { sessionId: string },
      ctx: any,
    ) => {
      const user = ctx.user;
      const userId = sessionId.split("-")[0];
      if (parseInt(userId) !== user.id) {
        throw new Error("Authorization required");
      }
      const value = await redis.get(`checkout-products-${sessionId}`);
      if (!value) {
        throw new Error("error exists");
      }
      const products = JSON.parse(value);
      const productIds = products.map(
        (product: { id: number; quantity: number }) => product.id,
      );
      const results = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        include: {
          images: {
            where: { url: { contains: "p1" } },
          },
        },
      });
      let total = 0;
      const newResult = results.map((result) => {
        const { id, name, price, images } = result;
        const item = products.find(
          (product: { id: number; quantity: number }) =>
            product.id === result.id,
        );
        const totalPrice = item.quantity * result.price;
        total += totalPrice;
        return {
          id,
          name,
          price,
          images,
          totalPrice,
          quantity: item.quantity,
        };
      });
      return {
        total,
        shippingCharge: 120,
        products: [...newResult],
      };
    },
    getProfile: async (_: any, __: any, ctx: any) => {
      const user = ctx.user;
      return await prisma.user.findFirst({
        where: { id: user.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          address: true,
          dateOfBirth: true,
        },
      });
    },
    getOrders: async (_: any, __: any, ctx: any) => {
      const user = ctx.user;
      const ans = await prisma.order.findMany({
        where: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { url: { contains: "p1" } },
                  },
                },
              },
            },
          },
        },
      });
      return ans;
    },
    getOrderConfirmation: async (
      _: any,
      args: { sessionId: string },
      ctx: any,
    ) => {

      const user = ctx.user;
      const s = args.sessionId.split('-')
      const orderId = s[0]
      const userId = s[s.length-1]
      if(user.id !== parseInt(userId)){
        throw new Error('Authorization required')
      }
      const order = await prisma.order.findFirst({
        where:{id:parseInt(orderId),userId:parseInt(userId)},
        include:{
          user:true
        }
      })
      if(order){
        return {
          id:order.id,
          email:order.user.email,
          total:order.total
        }
      } else {
        throw new Error('Authorization required')
      }
    },
  },
  Mutation: {
    updateCheckoutForm: async (_: any, args: any, ctx: any) => {
      const user = ctx.user;
      const { discountCode, ...formData } = args;
      const checkoutSession = await prisma.checkoutSession.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (checkoutSession) {
        await prisma.checkoutSession.update({
          where: {
            id: checkoutSession.id,
          },
          data: { ...formData },
        });
      } else {
        await prisma.checkoutSession.create({
          data: { ...formData, userId: user.id },
        });
      }
      return true;
    },
    updateProfile: async (
      _: any,
      args: {
        email: string;
        firstName: string;
        lastName: string;
        address: string;
        dateOfBirth: string;
      },
      ctx: any,
    ) => {
      const user = ctx.user;
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...args,
        },
      });
      return true;
    },
    deleteItemFromCart: async (_: any, args: any, ctx: any) => {
      const { itemId } = args;
      await prisma.cart.delete({
        where: { id: itemId },
      });
      return true;
    },
    updatePassword: async (_: any, args: any, ctx: any) => {
      const user = ctx.user;
      const cUser = await prisma.user.findFirst({
        where: { id: user.id },
      });

      if (cUser) {
        const { currentPassword, newPassword, confirmPassword } = args;
        const isMatched = await bcrypt.compare(currentPassword, cUser.password);
        if (isMatched && newPassword === confirmPassword) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          await prisma.user.update({
            where: { id: user.id },
            data: {
              password: hashedPassword,
            },
          });
          return true;
        } else throw new Error("Unauthorized");
      } else {
        throw new Error("User not found");
      }
    },
    updateCart: async (
      _: any,
      args: { productId: number; quantity?: number },
      ctx: any,
    ) => {
      const user = ctx.user;
      console.log(args, "args");
      const item = await prisma.cart.findFirst({
        where: {
          productId: args.productId,
          userId: user.id,
        },
      });
      if (item) {
        let quantityStep = 1;
        if (args.quantity && args.quantity === -1) {
          if (item.quantity > 1) quantityStep = -1;
        }
        await prisma.cart.update({
          where: { id: item.id },
          data: {
            quantity: args.quantity
              ? args.quantity + item.quantity
              : quantityStep + item.quantity,
          },
        });
        return true;
      } else {
        await prisma.cart.create({
          data: {
            productId: args.productId,
            quantity: args.quantity ? args.quantity : 1,
            userId: user.id,
          },
        });
        return true;
      }
    },
    changePassword:async(_:any,args:{email:string,code:string,newPassword:string,confirmPassword:string})=>{
    const userCode = await redis.get(`code-${args.email}`);
      if(userCode !== args.code || args.newPassword !== args.confirmPassword ) {
        return false
    } else {
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(args.newPassword,salt)
      await prisma.user.update({
        where:{email:args.email},
        data:{
          password:hashedPassword
        }
      })
      return true
    }
    }
  },
};

export default productResolvers;
