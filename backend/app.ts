import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import router from "./router";
import http from "http";
import path from "path";
import orderRouter from "./router/orderRouter";
import productResolvers from "./resolvers/product";
import { verifyJWT } from "./utils";
import { User } from "./types";
const app = express();

app.use("/assets", express.static(path.join(__dirname, "public/products")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.use("/api", router);
app.use("/api/order", orderRouter);
const typeDefs = `
type Image {
    id: Int!
    url: String!
    productId: Int!
}
    type Product {
    id: Int!
    name: String!
    price: Float!
    images: [Image]!
    url: String!
    stock: Int!
    quantity:Int
    description: String
}

type Cart {
    id:Int!
    quantity:Int!
    product:Product!
}

      input CheckoutProduct{
        id:Int!
        quantity:Int!
      }

      type CheckoutForm {
        email:String
        country:String
        firstName:String
        lastName:String
        address:String
        apartment:String
        city:String
        phone:String
      }
      type OrderSummary {
        total:Float
        shippingCharge:Float
        products:[Product]
      }
        type User {
          id:String!
          email:String!
          firstName:String!
          lastName:String!
          address:String!
          dateOfBirth:String!
        }
          type Item{
            productId:Int!
            quantity:Int!
            price:Int!
            product:Product
          }
          type Order {
            id:Int!
            status:String!
            total:Float!
            createdAt:String!
            items:[Item]
          }
            type MetaData {
            hasNextPage:Boolean
            lastCursor:Int
            }
          type ProductWithMetaData {
            products:[Product]
            metaData:MetaData
          }
            type OrderConfirmation {
              email:String!
              total:Float!
              id:Int!
            }
type Query {
    getProducts(first:Int,after:String):ProductWithMetaData

    getProduct(id:Int!):Product
    searchProduct(keyword:String!):[Product]
    getCartItems(userId:Int!):[Cart]
    getFeaturedProducts:[Product]
    getCartValue:Int!
    getCheckoutUrl(products:[CheckoutProduct]):String!
    getCheckoutForm(sessionId:String!):CheckoutForm
    getOrderSummary(sessionId:String!):OrderSummary
    getProfile:User

    getOrders:[Order]

    getOrderConfirmation(sessionId:String!):OrderConfirmation

}

type Mutation {
    addToCart(productId:Int!,quantity:Int!):String

    updateCheckoutForm(email:String!,
    country:String!,
    firstName:String!,
    lastName:String!,
    address:String!,
    apartment:String,
    city:String!,
    phone:String!,
    discountCode:String
    ):Boolean

    updateProfile(email:String!,
    lastName:String!,
    firstName:String!,
    address:String!,
    dateOfBirth:String!
    ):Boolean

    deleteItemFromCart(itemId:Int!):Boolean

    updatePassword(currentPassword:String!,newPassword:String!,confirmPassword:String!):Boolean

    updateCart(productId:Int!,quantity:Int):Boolean

    changePassword(email:String!,code:String!,newPassword:String!,confirmPassword:String!):Boolean
}
`;
async function createApp() {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers: productResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:3000",
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authenticatedQueries = [
          "getCartItems",
          "updateCart",
          "getCartValue",
          "getOrders",
          "getProfile",
          "getCheckoutUrl",
          "checkoutSessionForm",
          "updateCheckoutForm",
          "updatePassword",
          "updateProfile",
          'OrderConfirmation',
        ];
        const { operationName } = req.body;
        if (authenticatedQueries.includes(operationName)) {
          const authorizationHeader = req.headers.authorization;
          try{
            if(authorizationHeader){
              const token = authorizationHeader.split("Bearer")[1];
              if(token.trim()!=='undefined'){
                const payload = verifyJWT(token.trim()) as User;
                return { user: payload };
              } else throw new Error('Unauthorized user')
            }
            else {
            throw new Error('Unauthorized user ')
            }
          } catch(err){
            throw new Error('Internal server error ')

          }
        }
        return true;
      },
    }),
  );
  httpServer.listen(5000, () =>
    console.log("server is listening on port", 5000),
  );
  // await new Promise<void>((resolve) => httpServer.listen(5000, resolve));
}
createApp();
