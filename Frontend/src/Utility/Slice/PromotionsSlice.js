import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchData } from "../FetchFromApi";

// Define the fetchCart thunk
export const fetchPromotions = createAsyncThunk(
  "PromotionList/fetchPromotions",
  async () => {
    try {
      const response = await FetchData(`promotion/`, "get"); // Replace with your API URL
      // console.log(response);
      return response.data.data; // Assuming the API returns a list of cart items
    } catch (err) {
      console.error(err);
      return [];
    }
  }
);

const PromotionList = createSlice({
  name: "promotionList",
  initialState: {
    promotions: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.promotions = action.payload; // Populate cart with fetched data
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = PromotionList.actions;
export default PromotionList.reducer;
