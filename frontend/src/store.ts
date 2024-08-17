import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartslice";
const store = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default store;
