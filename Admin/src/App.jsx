import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
// import Home from "./Pages/Home/Home";
import Header from "./Components/Header";
import { useDispatch } from "react-redux";
import { FetchData } from "./Utility/FetchFromApi";
import { parseErrorMessage } from "./Utility/ErrorMessageParser";
import { useSelector } from "react-redux";
import { clearUser, addUser } from "./Utility/Slice/UserInfoSlice";
import Dashboard from "./Pages/Home/Home";
import AdminRegister from "./Pages/Register/Register";
import AdminLogin from "./Pages/Login/Login";

const App = () => {
  const user = useSelector((store) => store.UserInfo.user);

  const dispatch = useDispatch();
  useEffect(() => {
    const RefreshToken = localStorage.getItem("RefreshToken");
    if (!RefreshToken) return; // If no RefreshToken, don't proceed further

    async function reLogin() {
      try {
        const user = await FetchData("admins/re-login", "post", {
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
        alert(parseErrorMessage(error));
      }
    }

    reLogin();
  }, []);

  return (
    <div class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] overflow-x-hidden antialiased selection:bg-cyan-500 selection:text-cyan-900 font-Fredoka">
      <div className="text-black">
        <Header />
        <Routes>
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/" element={<AdminLogin />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
