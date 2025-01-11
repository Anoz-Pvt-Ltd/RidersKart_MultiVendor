import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header";
import Login from "./Pages/Login/Login";
import AllProducts from "./Pages/AllProducts/AllProducts";
import CurrentProduct from "./Pages/CurrentProduct/CurrentProduct";
import UserRegister from "./Pages/Register/Register";
import CartPage from "./Pages/Cart/Cart";
import { useDispatch } from "react-redux";
import { FetchData } from "./Utility/FetchFromApi";
import { parseErrorMessage } from "./Utility/ErrorMessageParser";
import { useSelector } from "react-redux";
import { clearUser, addUser } from "./Utility/Slice/UserInfoSlice";
import BuyNow from "./Pages/BuyNow/BuyNow";
import Dashboard from "./Pages/Profile/ProfileDashboard";

const App = () => {
  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);

  const dispatch = useDispatch();
  useEffect(() => {
    async function reLogin() {
      const RefreshToken = localStorage.getItem("RefreshToken");
      if (!RefreshToken) return;
      try {
        const user = await FetchData("users/re-login", "post", {
          RefreshToken,
        });

        console.log(user);
        localStorage.clear(); // will clear the all the data from localStorage
        localStorage.setItem("AccessToken", user.data.data.tokens.AccessToken);
        localStorage.setItem(
          "RefreshToken",
          user.data.data.tokens.RefreshToken
        );

        // Storing data inside redux store
        dispatch(clearUser());
        dispatch(addUser(user.data.data.user));
        return user;
      } catch (error) {
        console.log(error);
        alert(parseErrorMessage(error));
      }
    }

    reLogin();
  }, []);

  return (
    <div class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-x-hidden antialiased selection:bg-cyan-500 selection:text-cyan-900">
      <div className="text-black">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegister />} />
          <Route
            path="/user-profile/dashboard/:userId"
            element={<Dashboard />}
          />
          <Route
            path="/all-products/:category/:subcategory"
            element={<AllProducts />}
          />
          <Route
            path="/current-product/:productId"
            element={<CurrentProduct />}
          />
          <Route path="/cart/:userId" element={<CartPage />} />
          {/* <Route path="/cart/:userId/buy-now-product" element={<BuyNow />} /> */}
          <Route path="/checkout/:productId/:userId" element={<BuyNow />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
