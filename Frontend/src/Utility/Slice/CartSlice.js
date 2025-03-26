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

export const updateCartQuantity = createAsyncThunk(
  "CartList/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await FetchData(
        `users/${productId}/cart/edit-quantity`,
        "post",
        { quantity }
      );
      if (response.status === 200) {
        return { productId, quantity };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cart");
    }
  }
);


const CartList = createSlice({
  name: "cartList",
  initialState: {
    cart: [
    ],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addCart: (state, action) => {
      const exists = state.cart.some(
        (item) => item.product._id === action.payload._id
      );
      if (!exists) {
        console.log("Adding to cart");
        state.cart.push({ product: action.payload, quantity: 1 });
      } else {
        console.log("Item already exists in cart");
      }
    },
    removeCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.product._id !== action.payload
      );
    },
    addQuantity: (state, action) => {
      console.log("payload", action.payload);
      console.log("state.cart:", state);
      const index = state.cart.findIndex((item) => {
        console.log("item", item.product);
        return item.product._id === action.payload;
      });
      console.log(index);
      if (index !== -1) {
        state.cart[index].quantity += 1;
      } else {
        console.log("failed in adding quantity");
      }
    },
    subtractQuantity: (state, action) => {
      const index = state.cart.findIndex(
        (item) => item.product._id === action.payload
      );
      if (index !== -1) {
        state.cart[index].quantity -= 1;
      } else {
        console.log("failed in adding quantity");
      }
    },
    resetCart: (state) => {
      state.cart = [];
    },
    isExist: (state, action) => {
      return state.cart.some((item) => item.product._id === action.payload);
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
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const index = state.cart.findIndex(
          (item) => item.product._id === productId
        );
        if (index !== -1) {
          state.cart[index].quantity = quantity;
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        alert(action.payload || "Failed to update cart");
      });
  },
});

export const { addCart, removeCart, addQuantity, subtractQuantity, resetCart } =
  CartList.actions;
export default CartList.reducer;
