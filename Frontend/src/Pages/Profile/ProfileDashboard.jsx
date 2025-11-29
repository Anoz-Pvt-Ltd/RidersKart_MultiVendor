import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ListOrdered, Newspaper, User } from "lucide-react";
import { useNavigate } from "react-router";
import LoadingUI from "../../Components/Loading";
import ProfileSection from "./ProfileSection";
import OrderSection from "./OrderSection";
import WishListSection from "./WishListSection";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../Components/Button";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("activeSection") || "profile"
  );

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };
  const navigate = useNavigate();

  return user?.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828427.png"
        alt="Login Required"
        className="w-28 mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      />

      <motion.h2
        className="text-2xl font-semibold mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        You're Not Logged In
      </motion.h2>

      <motion.p
        className="text-gray-600 max-w-md mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Please register or log in to access your profile and manage your account
        information.
      </motion.p>
      <div className="flex justify-center items-center gap-5">
        <Button label={"Login Now"} onClick={() => navigate("/login")} />
        <Button label={"Register Now"} onClick={() => navigate("/register")} />
      </div>
      {/* <Link
        to="/login"
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all"
      >
        Login Now
      </Link> */}
    </div>
  ) : (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <motion.aside
        className="lg:w-64 text-black p-4 sticky top-0 left-0 z-40 lg:bg-black/10 bg-[#E8E8F5]"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <nav>
          <ul className="flex lg:flex-col justify-evenly items-center lg:jun">
            <li
              className={`lg:p-4 rounded-md lg:mb-2 cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "profile"
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("profile")}
            >
              {<User />}Profile
            </li>
            <li
              className={`lg:p-4 rounded-md lg:mb-2 cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "orders"
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("orders")}
            >
              {<ListOrdered />}Orders
            </li>
            <li
              className={`lg:p-4 rounded-md lg:mb-2 cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "wishlist"
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("wishlist")}
            >
              {<Heart />}Wishlist
            </li>
            <li
              className={`lg:p-4 rounded-md  cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "coupons"
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("coupons")}
            >
              {<Newspaper />} Coupons
            </li>
          </ul>
        </nav>
      </motion.aside>
      <main className="flex-1 p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
        >
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "orders" && <OrderSection />}
          {activeSection === "coupons" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Available Coupons</h2>
              <h2 className="mb-4">Currently no coupons are available</h2>
              {/* Coupons content */}
            </section>
          )}
          {activeSection === "wishlist" && <WishListSection />}
        </motion.div>
      </main>
    </div>
  );
};

export default LoadingUI(Dashboard);
