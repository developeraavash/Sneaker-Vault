import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gql, useMutation } from "@apollo/client";

type InitialState = {
  value: number;
};

const initialState: InitialState = {
  value: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartByValue: (state, { payload }) => {
      state.value += payload;
    },
    setInitCartValue: (state, { payload }) => {
      state.value = payload;
    },
    addToCart: (state) => {
      state.value += 1;
    },
    removeFromCart: (state) => {
      if (state.value > 1) state.value -= 1;
      else state.value = state.value;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setInitCartValue,
  updateCartByValue,
} = cartSlice.actions;
export default cartSlice.reducer;
