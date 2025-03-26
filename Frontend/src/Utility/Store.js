import { configureStore } from "@reduxjs/toolkit";
import UserInfoSlice from "./Slice/UserInfoSlice";
import CartList from "./Slice/CartSlice";

const store = configureStore({
  reducer: {
    UserInfo: UserInfoSlice,
    CartList: CartList,
  },
});

export default store;
