import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import { RouterProvider, BrowserRouter as Router,Routes, createBrowserRouter, Route } from "react-router-dom";
import Product from "./components/customer/product";
import Layout from "./layout";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import Cart from "./components/customer/cart";
import { Provider } from "react-redux";
import store from "./store";
import Checkout from "./components/checkout";
import Order from "./components/order";
import OrderConfirmation from "./components/orderConfirmation";
import PrivateRoute from "./components/privateRoute";
import AuthProvider from "./hooks/useAuth";
import Error from "./components/error";
import ForgotPassword from "./components/forgotPassword";

const SignIn = lazy(() => import("./components/customer/signIn"));
const JoinUs = lazy(() => import("./components/customer/joinUs"));
const Collections = lazy(() => import("./components/customer/collections"));
const Profile = lazy(() => import("./components/customer/profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      {
        path: "/cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path:'/forgot-password',
        element:(
          <ForgotPassword/>
        )
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/order",
        element: (
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        ),
        },
        {
          path: "checkout/:id",
          element: (
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          ),
        },
          {
            path:'*',
            element:<Error/>
          },
      {
        path:'/order-confirm/:id',
        element:(
          <PrivateRoute>
            <OrderConfirmation/>
          </PrivateRoute>
        )
      }
    ],
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "joinus",
    element: <JoinUs />,
  },


]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:5000/graphql",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")?.trim()}`,
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getProducts: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!existing) return incoming;
              return {
                metaData: incoming.metaData,
                products: [...existing.products, ...incoming.products],
              };
            },
          },
        },
      },
    },
  }),
});

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store()}>
        <ApolloProvider client={client}>
          <Suspense fallback={<div>loading...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </ApolloProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
);
