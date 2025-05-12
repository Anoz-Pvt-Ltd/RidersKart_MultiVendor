import React, { useEffect, useRef, useState } from "react";
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
import VendorRegistrationForm from "../src/Pages/VendorRegister/Registration";
import { fetchCart } from "./Utility/Slice/CartSlice";
import { fetchPromotions } from "./Utility/Slice/PromotionsSlice";
import RegisterDriver from "./Pages/DriverRegister/driverRegister";
import TermsAndConditions from "./Pages/Terms-and-Conditions/Terms-&-condition-users";
import RefundPolicy from "./Pages/Refund-Process/RefundProcess";
import DeliveryInstructions from "./Pages/Delivery-Instructions/DeliveryInstructions";
import Footer from "./Components/Footer";
import TermsConditionsVendors from "./Pages/Terms-and-Conditions/Terms-&-conditions-vendors";
// import { io } from "socket.io-client";

const App = () => {
  // const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  const user = useSelector((store) => store.UserInfo.user);

  const dispatch = useDispatch();
  useEffect(() => {
    // Check if RefreshToken exists in localStorage
    const RefreshToken = localStorage.getItem("RefreshToken");
    if (!RefreshToken) return; // If no RefreshToken, don't proceed further

    async function reLogin() {
      try {
        const user = await FetchData("users/re-login", "post", {
          RefreshToken,
        });

        // Clear localStorage and set new tokens
        localStorage.clear(); // will clear all the data from localStorage
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
      }
    }

    reLogin();
  }, []); // Empty dependency array ensures this runs once on component mount

  useEffect(() => {
    dispatch(fetchCart(user[0]?._id)); // Fetch categories when the component mounts
    dispatch(fetchPromotions()); // Fetch categories when the component mounts
  }, [dispatch, user]);

  // Socket connection
  // useEffect(() => {
  //   if (!socketRef.current) {
  //     socketRef.current = io("http://localhost:3000", {
  //       withCredentials: true, // ✅ Ensures cross-origin cookies and headers work
  //       transports: ["websocket"], // ✅ Forces WebSocket instead of polling (better for performance)
  //     });

  //     socketRef.current.on("newOrder", (notification) => {
  //       console.log("New order received:", notification);
  //       setNotifications((prev) => [...prev, notification]);
  //     });

  //     socketRef.current.on("connect", () => {
  //       console.log("Connected with socket ID:", socketRef.current.id);
  //     });

  //     socketRef.current.on("disconnect", () => {
  //       console.log("Disconnected from socket");
  //     });
  //   }

  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.disconnect();
  //       socketRef.current = null;
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   if (notifications.length > 0) {
  //     alertSuccess(notifications[notifications.length - 1]?.title);
  //   }
  // }, [notifications]);

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-x-hidden antialiased selection:bg-cyan-500 selection:text-cyan-900 font-Fredoka">
      <div className="text-black">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/vendor-register" element={<VendorRegistrationForm />} />
          <Route
            path="/user-profile/dashboard/:userId"
            element={<Dashboard />}
          />
          <Route
            path="/all-products/:category/:subcategory/:category_title/:subcategory_title"
            element={<AllProducts />}
          />
          <Route
            path="/current-product/:productId"
            element={<CurrentProduct />}
          />
          <Route path="/cart/:userId" element={<CartPage />} />
          {/* <Route path="/cart/:userId/buy-now-product" element={<BuyNow />} /> */}
          <Route path="/checkout/:productId/:orderId" element={<BuyNow />} />
          <Route
            path="/register-delivery-partner"
            element={<RegisterDriver />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/vendor-policy" element={<TermsConditionsVendors />} />
          <Route path="/refund-process" element={<RefundPolicy />} />
          <Route
            path="/delivery-instructions"
            element={<DeliveryInstructions />}
          />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;
