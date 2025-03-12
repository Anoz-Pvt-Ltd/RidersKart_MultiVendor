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

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((store) => store.UserInfo.user);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="flex justify-between items-center px-5 py-3  shadow-md relative">
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

      {/* Search Bar - Hidden in Mobile */}
      <div className="hidden md:block w-[50%]">
        <InputBox Placeholder="Search for products..." className="w-full" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        {user.length ? (
          <Button
            label={
              <h1 className="flex gap-2">
                <User2 /> {user?.[0]?.name}
              </h1>
            }
            onClick={() =>
              navigate(`/user-profile/dashboard/${user?.[0]?._id}`)
            }
          />
        ) : (
          <Button
            label={
              <h1 className="flex gap-2">
                <LogIn /> Login
              </h1>
            }
            onClick={() => navigate("/login")}
          />
        )}
        {/* <Button
          label={
            <h1 className="flex gap-2">
              <Store /> Become a Seller
            </h1>
          }
          onClick={() => navigate("/vendor-register")}
        /> */}
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link
            to={`/cart/${user?.[0]?._id}`}
            className="flex items-center gap-2"
          >
            <ShoppingCart /> <span>Cart</span>
          </Link>
        </motion.div>
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
