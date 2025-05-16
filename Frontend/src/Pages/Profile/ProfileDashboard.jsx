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

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const Dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState();
  const fromRef = useRef(null);
  const [allOrders, setAllOrders] = useState([]);
  

  const openModal = () => {
    setShowModal(true);
  };
  const openModal2 = () => {
    setShowModal2(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setNewAddress({
      street: "",
      city: "",
      country: "",
      postalCode: "",
      state: "",
    });
    setError(null); // Reset any errors
  };
  // Close modal
  const closeModal2 = () => {
    setShowModal2(false);
    setEditProfile({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
    setError(null); // Reset any errors
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  // console.log(user?.[0]?._id);
  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/all-products-of/${user?.[0]?._id}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.orders);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
          stopLoading();
        }
      }
    };
    fetchAllOrders();
  }, [user]);

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

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(fromRef.current);
    try {
      startLoading();
      const response = await FetchData(
        `users/edit-user-profile/${user?.[0]?._id}`,
        "post",
        formData
      );
      console.log(response);
      if (response.data.success) {
        alert("Profile updated successfully");
        closeModal2();
        window.location.reload();
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      stopLoading();
    }
  };

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
          {activeSection === "orders" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Orders</h2>
              <div className="flex justify-start items-start gap-5 flex-wrap p-5 ">
                {console.log(allOrders)}
                {allOrders?.map((product, index) => (
                  <ProductCard
                    Image={product?.products[0]?.product?.images[0]?.url}
                    key={index}
                    ProductName={product?.products[0]?.product?.name}
                    CurrentPrice={product?.products?.[0]?.price?.sellingPrice}
                    Mrp={product?.products?.[0]?.price?.MRP}
                    Discount={product?.products?.[0]?.price?.discount}
                    Rating={product?.products?.[0]?.product?.Rating}
                    Offer={product?.products?.[0]?.product?.off}
                    Description={product?.products?.[0]?.product?.description}
                    productId={product?.products?.[0]?.product?._id}
                  />
                ))}
              </div>
            </section>
          )}
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
