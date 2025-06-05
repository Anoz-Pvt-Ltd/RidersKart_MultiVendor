import { createSlice } from "@reduxjs/toolkit";

const UserInfo = createSlice({
  name: "userinfo",
  initialState: {
    user: [],
    isProductAvailableForUser: true,
  },
  reducers: {
    addUser: (state, action) => {
      state.user.push(action.payload);
    },
    toggleProductAvailability: (state, action) => {
      state.isProductAvailableForUser = action.payload;
    },
    clearUser: (state) => {
      state.user = [];
    },
  },
});

export const { addUser, clearUser, toggleProductAvailability } =
  UserInfo.actions;

export default UserInfo.reducer;
