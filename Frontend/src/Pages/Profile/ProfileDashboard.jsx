import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import ProductCard from "../../Components/ProductCard";
import {
  Edit,
  Heart,
  ListOrdered,
  LogOut,
  Newspaper,
  PencilLine,
  Plus,
  ShoppingBag,
  Trash,
  User,
  UserCheck,
} from "lucide-react";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading/Loading.json";
import { useNavigate } from "react-router";
import { clearUser } from "../../Utility/Slice/UserInfoSlice";
import ProductCardMobile from "../../Components/ProductCardMobile";
import LoadingUI from "../../Components/Loading";
import ProfileSection from "./ProfileSection";
import OrderSection from "./OrderSection";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [wishlistProducts, setWishlistProducts] = useState();
  const [allOrders, setAllOrders] = useState([]);

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fetchWishlistProducts = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(
          `users/${user?.[0]?._id}/wishlist-products`,
          "get"
        );
        console.log(response);
        if (response.data.success) {
          setWishlistProducts(response.data.data);
        } else {
          setError("Failed to load Wishlist products.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch Wishlist products."
        );
      } finally {
        stopLoading();
      }
    }
  };
  useEffect(() => {
    fetchWishlistProducts();
  }, [user]);

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };

  return !user ? (
    <div className="w-screen  flex justify-center items-center">
      <Lottie width={50} height={50} animationData={Loading} />
    </div>
  ) : (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <motion.aside
        className="lg:w-64 text-black p-4 shadow-lg"
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
                activeSection === "coupons"
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("coupons")}
            >
              {<Newspaper />} Coupons
            </li>
            <li
              className={`lg:p-4 rounded-md cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "wishlist"
                  ? "bg-[#DF3F33] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("wishlist")}
            >
              {<Heart />}Wishlist
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
              {/* Coupons content */}
            </section>
          )}
          {activeSection === "wishlist" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
              {/* Wishlist content */}
              <h1>
                Your wishlist is here with {""}
                <span>{wishlistProducts?.length} items.</span>
              </h1>
              {console.log(wishlistProducts)}
              <div className="flex justify-start items-start gap-5 flex-wrap p-5">
                {wishlistProducts?.map((product, index) => (
                  <ProductCard
                    Image={product?.images[0]?.url}
                    key={index}
                    ProductName={product?.name}
                    CurrentPrice={product?.price?.sellingPrice}
                    Mrp={product?.price?.MRP}
                    // Rating={product?.products?.[0]?.product?.Rating}
                    Discount={product?.price?.discount}
                    Description={product?.description}
                    productId={product?._id}
                  />
                ))}
              </div>
              {/* <div className="flex justify-start items-start gap-5 flex-wrap lg:hidden">
                {wishlistProducts?.map((product, index) => (
                  <ProductCardMobile
                    Image={product?.images[0]?.url}
                    key={product._id}
                    ProductName={product.name}
                    CurrentPrice={product.price}
                    Mrp={product.price}
                    Rating={product.rating || "No rating"}
                    Offer="No offer"
                    Category={product.category.main}
                    StockQuantity={product.stockQuantity}
                  />
                ))}
              </div> */}
            </section>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LoadingUI(Dashboard);
