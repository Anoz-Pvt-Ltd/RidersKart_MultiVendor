import { Search, ShoppingCart } from "lucide-react";
import React from "react";
import Button from "./Button";
import { Navigate, useNavigate } from "react-router";

const Header = () => {
  const Navigate = useNavigate();

  const NavigateLogin = () => {
    Navigate("/login");
  };

  return (
    <header className="headerBg text-white flex justify-center items-center">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flipkart_logo.png/800px-Flipkart_logo.png"
            alt="Logo"
            className="h-8"
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 hidden sm:flex justify-center">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-1/2 px-4 py-2 rounded-l-md text-gray-800 outline-none"
          />
          <button className="bg-yellow-500 px-4 py-2 rounded-r-md hover:bg-yellow-600">
            <Search />
          </button>
        </div>

        {/* User Options */}
        <div className="flex items-center space-x-4">
          <Button label={"Login"} onClick={NavigateLogin} />
          <Button label={"Become a Seller"} onClick={NavigateLogin} />
          <button className="hidden sm:block hover:underline">More</button>

          {/* Cart */}
          <div className="flex items-center space-x-1">
            <ShoppingCart />
            <span>Cart</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
