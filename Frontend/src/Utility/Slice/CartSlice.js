import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchData } from "../FetchFromApi";

// Define the fetchCart thunk
export const fetchCart = createAsyncThunk(
  "CartList/fetchCart",
  async (user) => {
    try {
      const response = await FetchData(`users/${user}/cart-products`, "get"); // Replace with your API URL
      // console.log(response);
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

export const addProductToCart = createAsyncThunk(
  "CartList/addProductToCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await FetchData(
        `products/get-single-product/${productId}`,
        "get"
      );
      console.log("Hello", response);
      if (response.status === 200) {
        return response.data.data; // product details
      } else {
        return rejectWithValue("Failed to fetch product");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching product");
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
    deleteFromCart: (state, action) => {
      console.log("Before removing:", state.cart);
      if (!Array.isArray(state.cart))
        console.error("Cart is not an array", state.cart);

      state.cart = state.cart.filter((item) => {
        return item.product._id !== action.payload;
      });
    },
    addQuantity: (state, action) => {
      const index = state.cart.findIndex((item) => {
        return item.product._id === action.payload;
      });
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
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        const product = action.payload;
        const exists = state.cart.some(
          (item) => item.product._id === product._id
        );
        if (!exists) {
          state.cart.push({ product, quantity: 1 });
        }
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        console.error("Failed to add product to cart:", action.payload);
      });
  },
});

export const {
  addCart,
  deleteFromCart,
  addQuantity,
  subtractQuantity,
  resetCart,
} = CartList.actions;
export default CartList.reducer;
