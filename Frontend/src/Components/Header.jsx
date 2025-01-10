import { Search, ShoppingCart } from "lucide-react";
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
  console.log(user);

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
            <Button label={user?.[0]?.name} onClick={NavigateToProfile} />
          </div>
        ) : (
          <div>
            <Button label={"Login"} onClick={NavigateLogin} />
          </div>
        )}
        <Button label={"Become a Seller"} onClick={NavigateVendorRegister} />
        <button className="hidden sm:block hover:underline">More</button>

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
  // return (
  //   <header className="headerBg text-white flex justify-center items-center">
  //     <div className="container mx-auto flex items-center justify-between py-2 px-4">
  //       {/* Logo */}
  //       <div className="flex items-center space-x-2">
  //         <img
  //           src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flipkart_logo.png/800px-Flipkart_logo.png"
  //           alt="Logo"
  //           className="h-8"
  //         />
  //       </div>

  //       {/* Search Bar */}
  //       <div className="flex-1 mx-4 hidden sm:flex justify-center">
  //         <input
  //           type="text"
  //           placeholder="Search for products, brands and more"
  //           className="w-1/2 px-4 py-2 rounded-l-md text-gray-800 outline-none"
  //         />
  //         <button className="bg-yellow-500 px-4 py-2 rounded-r-md hover:bg-yellow-600">
  //           <Search />
  //         </button>
  //       </div>

  //       {/* User Options */}
  //       <div className="flex items-center space-x-4">
  //         <Button label={"Login"} onClick={NavigateLogin} />
  //         <Button label={"Become a Seller"} onClick={NavigateVendorRegister} />
  //         <button className="hidden sm:block hover:underline">More</button>

  //         {/* Cart */}
  //         <div className="flex items-center space-x-1">
  //           <ShoppingCart />
  //           <span>Cart</span>
  //         </div>
  //       </div>
  //     </div>
  //   </header>
  // );
};

export default Header;
