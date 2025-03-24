import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchData } from "../FetchFromApi";

// Define the fetchCart thunk
export const fetchCart = createAsyncThunk(
  "CartList/fetchCart",
  async (user) => {
    try {
      const response = await FetchData(`users/${user}/cart-products`, "get"); // Replace with your API URL
      console.log(response);
      return response.data.data; // Assuming the API returns a list of cart items
    } catch (err) {
      console.error(err);
      return [];
    }
  }
);

const CartList = createSlice({
  name: "cartList",
  initialState: {
    cart: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addCart: (state, action) => {
      const exists = state.cart.some((item) => item._id === action.payload._id);
      if (!exists) {
        state.cart.push(action.payload);
      }
    },
    removeCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },
    updateCart: (state, action) => {
      const { _id, newData } = action.payload;
      const index = state.cart.findIndex((item) => item._id === _id);
      if (index !== -1) {
        state.cart[index] = { ...state.cart[index], ...newData };
      }
    },
    resetCart: (state) => {
      state.cart = [];
    },
    isExist: (state, action) => {
      return state.cart.some((item) => item._id === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload; // Populate cart with fetched data
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCart, removeCart, updateCart, resetCart } = CartList.actions;
export default CartList.reducer;
