import { configureStore } from "@reduxjs/toolkit";
import UserInfoSlice from "./Slice/UserInfoSlice";
import CartList from "./Slice/CartSlice";
import PromotionList from "./Slice/PromotionsSlice";
import RatingSlice from "./Slice/RatingSlice";

const store = configureStore({
  reducer: {
    UserInfo: UserInfoSlice,
    CartList: CartList,
    PromotionList: PromotionList,
    Rating: RatingSlice,
  },
});

export default store;
