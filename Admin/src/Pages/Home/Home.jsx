import React, { useState } from "react";
import {
  Heart,
  ListOrdered,
  Package,
  ScanLine,
  User,
  Bike,
  IndianRupee,
  MemoryStick,
  ChartColumnStacked,
  Vote,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import LoadingUI from "../../Components/Loading";
import Users from "../Users/Users";
import VendorUnderReview from "../Vendor_UnderReview/VendorUnderReview";
import VendorsVerified from "../Vendors_Verified/VendorsVerified";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";
import Brandsverified from "../Brands_Verified/Brandsverified";
import BrandsUnderReview from "../Brands_UnderReview/BrandsUnderReview";
import Promotion from "../Promotions/promotion";
import TransactionOnline from "../TransactionOnline/TransactionOnline";
import TransactionCash from "../TransactionCash/TransactionCash";
import VendorsOrders from "../VendorsOrders/VendorsOrders";
import DriverVerified from "../Driver_Verified/DriverVerified";
import DriverUnderReview from "../Driver_UnderReview/DriverUnderReview";
import CategoriesVerified from "../CategoriesVerified/CategoriesVerified";
import CategoriesUnderReview from "../CategoriesUnderReview/CategoriesUnderReview";
import Policies from "../Policy/Policies";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);

  // State for sidebar collapsible sections
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isDriverOpen, setIsDriverOpen] = useState(false);

  const localActiveSection = localStorage.getItem("activeSection");
  const [activeSection, setActiveSection] = useState(
    localActiveSection ?? "Users"
  );

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const sidebarSections = [
    {
      label: "Users",
      icon: <User />,
      section: "Users",
    },
    {
      label: "Vendors",
      icon: <ListOrdered />,
      nested: [
        { label: "Under review", section: "Vendors (Under review)" },
        { label: "Verified", section: "Vendors (Verified)" },
        { label: "Vendors Orders", section: "Vendors Orders" },
      ],
      isOpen: isVendorOpen,
      setOpen: setIsVendorOpen,
    },
    {
      label: "Brands",
      icon: <MemoryStick />,
      nested: [
        { label: "Under review", section: "Brands (Under review)" },
        { label: "Verified", section: "Brands (Verified)" },
      ],
      isOpen: isBrandOpen,
      setOpen: setIsBrandOpen,
    },
    {
      label: "Category & Subcategory",
      icon: <ChartColumnStacked />,
      nested: [
        { label: "Under review", section: "Categories (Under review)" },
        { label: "Verified", section: "Categories (Verified)" },
      ],
      isOpen: isCategoryOpen,
      setOpen: setIsCategoryOpen,
    },
    {
      label: "Products",
      icon: <Package />,
      section: "Products",
    },
    {
      label: "Orders",
      icon: <ScanLine />,
      section: "Orders",
    },
    {
      label: "Transactions",
      icon: <IndianRupee />,
      nested: [
        {
          label: (
            <>
              Transactions <br />
              (Online payment)
            </>
          ),
          section: "Transactions (Online payment)",
        },
        {
          label: (
            <>
              Transactions <br />
              (Cash on delivery)
            </>
          ),
          section: "Transactions (Cash on delivery)",
        },
      ],
      isOpen: isTransactionOpen,
      setOpen: setIsTransactionOpen,
    },
    {
      label: "Driver",
      icon: <Bike />,
      nested: [
        {
          label: (
            <>
              Drivers <br />
              (Under review)
            </>
          ),
          section: "Drivers (Under review)",
        },
        {
          label: (
            <>
              Drivers <br />
              (Verified)
            </>
          ),
          section: "Drivers (Verified)",
        },
      ],
      isOpen: isDriverOpen,
      setOpen: setIsDriverOpen,
    },
    {
      label: "Promotions",
      icon: <Heart />,
      section: "Promotions",
    },
    {
      label: "Policies",
      icon: <Vote />,
      section: "Policies",
    },
  ];

  const sectionComponents = {
    Users: <Users />,
    "Vendors (Under review)": <VendorUnderReview />,
    "Vendors (Verified)": <VendorsVerified />,
    "Vendors Orders": <VendorsOrders />,
    Products: <Products />,
    "Brands (Verified)": <Brandsverified />,
    "Brands (Under review)": <BrandsUnderReview />,
    "Categories (Verified)": <CategoriesVerified />,
    "Categories (Under review)": <CategoriesUnderReview />,
    Orders: <Orders />,
    "Transactions (Online payment)": <TransactionOnline />,
    "Transactions (Cash on delivery)": <TransactionCash />,
    "Drivers (Under review)": <DriverUnderReview />,
    "Drivers (Verified)": <DriverVerified />,
    Promotions: <Promotion />,
    Policies: <Policies />,
  };

  return (
    <div className="flex min-h-screen overflow-scroll">
      {user === null || user.length === 0 ? (
        <div>
          <h1>
            You are not logged in kindly request your Team leader to provide you
            an Admin id and password.
          </h1>
        </div>
      ) : (
        <div>
          <motion.aside
            className="w-64 text-black p-4 shadow-lg fixed overscroll-auto top-0 h-screen bg-black/50 overflow-scroll no-scrollbar z-10"
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
          >
            <nav>
              <ul>
                {sidebarSections.map((item) => {
                  if (!item.nested) {
                    return (
                      <li
                        key={item.section}
                        className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                          activeSection === item.section
                            ? "bg-[#DF3F33] text-white"
                            : "bg-gray-300 text-black"
                        }`}
                        onClick={() => {
                          setActiveSection(item.section);
                          localStorage.setItem("activeSection", item.section);
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </li>
                    );
                  }
                  // Handle nested sections
                  return (
                    <li className="mb-2" key={item.label}>
                      <div
                        className="p-4 rounded-md cursor-pointer bg-gray-300 text-black hover:bg-gray-400 transition-all"
                        onClick={() => item.setOpen(!item.isOpen)}
                      >
                        {item.icon}
                        {item.label}
                      </div>
                      {item.isOpen && (
                        <ul className="ml-6 mt-2">
                          {item.nested.map((nestedItem) => (
                            <li
                              key={nestedItem.section}
                              className={`p-3 rounded-md cursor-pointer mb-2 transition-all ${
                                activeSection === nestedItem.section
                                  ? "bg-[#DF3F33] text-white"
                                  : "bg-gray-200 text-black"
                              }`}
                              onClick={() => {
                                setActiveSection(nestedItem.section);
                                localStorage.setItem(
                                  "activeSection",
                                  nestedItem.section
                                );
                              }}
                            >
                              {nestedItem.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
          <main className="flex-1 p-6 ml-64 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              transition={{ duration: 0.5 }}
            >
              {sectionComponents[activeSection] || null}
            </motion.div>
          </main>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(Dashboard);
// ...existing code...
