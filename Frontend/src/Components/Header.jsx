import { LogIn, Search, ShoppingCart, Store, User2 } from "lucide-react";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Button from "./Button";
import InputBox from "./InputBox";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Header = () => {
  const Navigate = useNavigate();

  const NavigateLogin = () => {
    Navigate("/login");
  };
  const NavigateVendorRegister = () => {
    Navigate("/vendor-register");
  };
  const NavigateToProfile = () => {
    Navigate(`/user-profile/dashboard/${user?.[0]?._id}`);
  };
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);

  return (
    <header className="flex justify-between items-center mb-4 px-5 ">
      {/* Logo */}
      <div className="flex items-center">
        <Link to={"/"}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flipkart_logo.png/800px-Flipkart_logo.png"
            alt="Logo"
            className="h-8"
          />
        </Link>
      </div>
      <div className=" w-[50%]">
        <InputBox Placeholder="Search for products..." className={"w-full"} />
      </div>
      <div className="flex items-center gap-5">
        {user.length ? (
          <div>
            <Button
              label={
                <h1 className="flex justify-start gap-2">
                  <span>
                    <User2 />
                  </span>
                  {user?.[0]?.name}
                </h1>
              }
              onClick={NavigateToProfile}
            />
          </div>
        ) : (
          <div>
            <Button
              label={
                <h1 className="flex  justify-start gap-2">
                  <span>
                    <LogIn />
                  </span>
                  Login{" "}
                </h1>
              }
              onClick={NavigateLogin}
            />
          </div>
        )}
        <Button
          label={
            <h1 className="flex justify-start gap-2">
              <span>
                <Store />
              </span>
              Become a Seller{" "}
            </h1>
          }
          onClick={NavigateVendorRegister}
        />

        {/* Cart */}
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={`/cart/${user?.[0]?._id}`} className="flex items-center">
            <ShoppingCart />
            <span>Cart</span>
          </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
