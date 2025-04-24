import {
  LogIn,
  Search,
  ShoppingCart,
  Store,
  User2,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import InputBox from "./InputBox";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import logo from "../assets/Logo.png";
import { PlatformName } from "../Constants/Global";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((store) => store.UserInfo.user);
  const cart = useSelector((store) => store.CartList.cart);
  const cartCount = cart.length;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="flex justify-between items-center px-5 py-3  shadow-md relative">
      {/* Logo */}
      <div className="flex items-center lg:pl-20 justify-center">
        <Link to={"/"} className="flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-20" />
          <h1 className="text-xl font-bold">{PlatformName}</h1>
        </Link>
      </div>

      {/* Search Bar - Hidden in Mobile */}
      <div className="hidden md:block w-[60%]">
        <InputBox Placeholder="Search for products..." className="w-full" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        {user.length ? (
          <div className="flex items-center gap-5">
            <Button
              className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
              label={
                <h1 className="flex gap-2">
                  <User2 /> {user?.[0]?.name}
                </h1>
              }
              onClick={() =>
                navigate(`/user-profile/dashboard/${user?.[0]?._id}`)
              }
            />
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to={`/cart/${user?.[0]?._id}`}
                className="text-blue-600 px-4 py-2 rounded  duration-300 ease-in-out hover:shadow-md shadow-neutral-600 hover:translate-y-1 border border-neutral-300 hover:border-none flex  bg-white hover:bg-green-500 hover:text-black"
              >
                <ShoppingCart />{" "}
                <span className="bg-red-400 px-2 rounded-full text-black">
                  {cartCount}
                </span>
              </Link>
            </motion.div>
          </div>
        ) : (
          <Button
            className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
            label={
              <h1 className="flex gap-2">
                <LogIn /> Login
              </h1>
            }
            onClick={() => navigate("/login")}
          />
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <motion.button
        className="md:hidden lg:hidden"
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 120 }}
          className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg p-5 flex flex-col gap-5 md:hidden z-50"
        >
          <button className="self-end" onClick={toggleMenu}>
            <X size={28} />
          </button>
          {user.length ? (
            <Button
              className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
              label={
                <h1 className="flex gap-2">
                  <User2 /> {user?.[0]?.name}
                </h1>
              }
              onClick={() => {
                navigate(`/user-profile/dashboard/${user?.[0]?._id}`);
                toggleMenu();
              }}
            />
          ) : (
            <Button
              className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
              label={
                <h1 className="flex gap-2">
                  <LogIn /> Login
                </h1>
              }
              onClick={() => {
                navigate("/login");
                toggleMenu();
              }}
            />
          )}
          {/* <Button
            label={
              <h1 className="flex gap-2">
                <Store /> Become a Seller
              </h1>
            }
            onClick={() => {
              navigate("/vendor-register");
              toggleMenu();
            }}
          /> */}
          <Link
            to={`/cart/${user?.[0]?._id}`}
            className="flex items-center gap-2"
            onClick={toggleMenu}
          >
            <ShoppingCart /> <span>Cart</span>
          </Link>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
