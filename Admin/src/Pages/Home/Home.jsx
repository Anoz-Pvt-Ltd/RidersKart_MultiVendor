import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  ListOrdered,
  Newspaper,
  Package,
  PencilLine,
  ScanLine,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import { ClipboardCopy } from "lucide-react";
import LoadingUI from "../../Components/Loading";
import Users from "../Users/Users";
import VendorUnderReview from "../Vendor_UnderReview/VendorUnderReview";
import VendorsVerified from "../Vendors_Verified/VendorsVerified";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";
import Brandsverified from "../Brands_Verified/Brandsverified";
import BrandsUnderReview from "../Brands_UnderReview/BrandsUnderReview";
import Promotion from "../Promotions/promotion";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [activeSection, setActiveSection] = useState("Users");
  const [error, setError] = useState("");

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const tableHeadersBrands = [
    "Brand ID",
    "Brand name",
    "Added by",
    "Added On",
    "Status",
  ];

  //filtering functions for each entities

  return (
    <div className="flex min-h-screen">
      <motion.aside
        className="w-64 text-black p-4 shadow-lg fixed overscroll-auto top-0 h-screen"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <nav>
          <ul>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Users"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Users")}
            >
              {<User />}Users
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Vendors (Under review)"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Vendors (Under review)")}
            >
              {<ListOrdered />}Vendors (Under review)
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Vendors (Verified)"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Vendors (Verified)")}
            >
              {<Newspaper />}Vendors (Verified)
            </li>

            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Brands (Under review)"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Brands (Under review)")}
            >
              {<Package />}Brands (Under review)
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Brands (Verified)"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Brands (Verified)")}
            >
              {<Package />}Brands (Verified)
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Products"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Products")}
            >
              {<Package />}Products
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Orders")}
            >
              {<ScanLine />}Orders
            </li>
            <li
              className={`p-4 rounded-md cursor-pointer transition-all duration-300 ${
                activeSection === "Promotions"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Promotions")}
            >
              {<Heart />}Promotions
            </li>
          </ul>
        </nav>
      </motion.aside>
      <main className="flex-1 p-6 ml-64">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
        >
          {activeSection === "Users" && <Users />}
          {activeSection === "Vendors (Under review)" && <VendorUnderReview />}
          {activeSection === "Vendors (Verified)" && <VendorsVerified />}
          {activeSection === "Products" && <Products />}
          {activeSection === "Brands (Verified)" && <Brandsverified />}
          {activeSection === "Brands (Under review)" && <BrandsUnderReview />}
          {activeSection === "Orders" && <Orders />}
          {activeSection === "Promotions" && <Promotion />}
        </motion.div>
      </main>
    </div>
  );
};

export default LoadingUI(Dashboard);
