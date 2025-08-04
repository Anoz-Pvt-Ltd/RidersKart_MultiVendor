import {
  LogIn,
  Search,
  ShoppingCart,
  User2,
  Menu,
  X,
  Home,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const searchedValue = useParams().searchData;
  const [searchInput, setSearchInput] = useState(searchedValue || "");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search-page/${searchInput}`);
    }
  };

  return (
    <header className='flex justify-between items-center px-5 py-3  shadow-md relative'>
      {/* Hamburger opening button */}
      <motion.button
        className='md:hidden lg:hidden flex justify-center items-center gap-2'
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>
      {/* Logo */}
      <div className='flex items-center lg:pl-20 justify-center gap-5'>
        <Link to={"/"} className='flex items-center justify-center'>
          <img src={logo} alt='Logo' className='lg:h-20 h-12' />
          <h1 className='lg:text-xl   '>{PlatformName}</h1>
        </Link>
        <Link
          to={"/"}
          className='flex items-center justify-center hover:scale-110 duration-300 ease-in-out hover:text-red-500'
        >
          {/* <img src={logo} alt="Logo" className="lg:h-20 h-12" /> */}
          <h1 className=''>
            <Home />
          </h1>
        </Link>
      </div>

      {/* Search Bar - Hidden in Mobile */}
      <div className='hidden md:flex justify-center items-center w-[50%] h-20 '>
        <InputBox
          Value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          Placeholder='Search for products...'
          className='w-full '
          keyPress={handleSearch}
        />
        <button onClick={handleSearch} className='relative right-10 mt-2 '>
          <Search />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center gap-5'>
        {user.length ? (
          <div className='flex items-center gap-5'>
            <Button
              className={`hover:bg-green-500 hover:text-black`}
              label={
                <h1 className='flex justify-center items-center gap-2 text-sm'>
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
                className='text-blue-600 px-4 py-2 rounded  duration-300 ease-in-out hover:shadow-md shadow-neutral-600 hover:translate-y-1 border border-neutral-300 hover:border-none flex  bg-white hover:bg-green-500 hover:text-black'
              >
                <ShoppingCart />{" "}
                <span className='bg-[#DF3F33] px-2 rounded-full text-white'>
                  {cartCount}
                </span>
              </Link>
            </motion.div>
          </div>
        ) : (
          <Button
            className={`hover:bg-green-500 hover:text-black`}
            label={
              <h1 className='flex gap-2'>
                <LogIn /> Login
              </h1>
            }
            onClick={() => navigate("/login")}
          />
        )}
      </div>

      {/* Mobile Hamburger Button */}

      <motion.div whileHover={{ scale: 1.1 }}>
        <Link
          to={`/cart/${user?.[0]?._id}`}
          className='text-blue-600  rounded  duration-300 ease-in-out shadow-neutral-600 flex lg:hidden'
        >
          <ShoppingCart />{" "}
          <span className='bg-[#DF3F33] px-2 rounded-full text-white text-xs text-center flex justify-center items-center'>
            {cartCount}
          </span>
        </Link>
      </motion.div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 120 }}
          className='fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg p-5 flex flex-col gap-5 md:hidden z-50'
        >
          <button className='self-end' onClick={toggleMenu}>
            <X size={28} />
          </button>
          {user.length ? (
            <Button
              className={` hover:bg-green-500 hover:text-black`}
              label={
                <h1 className='flex gap-2'>
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
              className={` hover:bg-green-500 hover:text-black`}
              label={
                <h1 className='flex gap-2'>
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
            className='flex items-center gap-2'
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
