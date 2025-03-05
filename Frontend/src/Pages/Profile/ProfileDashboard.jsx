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

const Dashboard = () => {
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
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    country: "",
    postalCode: "",
    state: "",
  });
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddressInputChange2 = (e) => {
    const { name, value } = e.target;
    setEditProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addAddress = async () => {
    try {
      const response = await FetchData(
        `users/${user?.[0]?._id}/addresses`,
        "post",
        newAddress
      );
      if (response.data.success) {
        // Assuming the response includes the new list of addresses
        console.log(response.data.data);
        alert("Address added successfully");
        setShowModal(false); // Close modal after success
      } else {
        setError("Failed to add address.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add address.");
    }
  };

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

  const handleAddressChange = (index) => {
    setSelectedAddressIndex(index);
  };

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `orders/all-products-of/${user?.[0]?._id}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.orders);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };
    fetchAllOrders();
  }, [user]);

  const fetchWishlistProducts = async () => {
    if (user?.length > 0) {
      try {
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
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("profile")}
            >
              {<User />}Profile
            </li>
            <li
              className={`lg:p-4 rounded-md lg:mb-2 cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("orders")}
            >
              {<ListOrdered />}Orders
            </li>
            <li
              className={`lg:p-4 rounded-md lg:mb-2 cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "coupons"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("coupons")}
            >
              {<Newspaper />} Coupons
            </li>
            <li
              className={`lg:p-4 rounded-md cursor-pointer transition-all duration-300 p-2 flex flex-col justify-center items-center lg:justify-start lg:items-start lg:w-full ${
                activeSection === "wishlist"
                  ? "bg-blue-600 text-white"
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
          {activeSection === "profile" && (
            <section className="flex justify-center items-center flex-col">
              <div className="flex lg:flex-row flex-col w-full justify-evenly items-center mb-20 lg:shadow py-10 rounded-xl">
                <div className="name">
                  <h2 className="text-2xl font-bold mb-4 flex justify-center items-center hidden lg:block">
                    <span>
                      <UserCheck className="mr-5" />
                    </span>
                    Your Profile
                  </h2>
                  <p>
                    Name:{" "}
                    <span className="lg:text-2xl font-bold">
                      {user?.[0]?.name}
                    </span>
                  </p>
                  <p>
                    Email:{" "}
                    <span className="lg:text-2xl font-bold">
                      {user?.[0]?.email}
                    </span>
                  </p>
                  <p>
                    Number:{" "}
                    <span className="lg:text-2xl font-bold">
                      {user?.[0]?.phoneNumber}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-5 justify-center items-center mt-10 lg:mt-0">
                  <div className="button flex flex-col lg:flex-row justify-evenly items-center gap-5">
                    <Button
                      onClick={navigateHome}
                      // label={<ShoppingBag/>"Continue Shopping"}
                      label={
                        <h1 className="flex justify-start gap-2">
                          <span>
                            <ShoppingBag />
                          </span>
                          Continue Shopping{" "}
                        </h1>
                      }
                    />
                    <Button
                      onClick={() => {
                        Dispatch(clearUser());
                        localStorage.removeItem("AccessToken");
                        localStorage.removeItem("RefreshToken");
                        alert("You are logged out! Please log in.");
                        setTimeout(() => navigate("/login"), 100);
                        console.log(localStorage.getItem("RefreshToken"));
                      }}
                      className={"hover:bg-orange-500"}
                      label={
                        <h1 className="flex justify-start gap-2">
                          <span>
                            <LogOut />
                          </span>
                          Log Out{" "}
                        </h1>
                      }
                    />
                    {/* <Button label={"Add Address"} /> */}
                  </div>
                  <div className="button flex flex-col lg:flex-row justify-evenly items-center gap-5">
                    <Button
                      onClick={openModal}
                      label={
                        <h1 className="flex justify-start gap-2">
                          <span>
                            <Plus />
                          </span>
                          Add Address{" "}
                        </h1>
                      }
                    />
                    <Button
                      onClick={openModal2}
                      label={
                        <h1 className="flex justify-start gap-2">
                          <span>
                            <Edit />
                          </span>
                          Edit Profile{" "}
                        </h1>
                      }
                    />
                    {/* <Button label={"Add Address"} /> */}
                  </div>
                </div>
              </div>
              <div className="address flex flex-wrap flex-col">
                <p className="m-10 font-bold text-xl">
                  Select a Default Address:
                </p>
                {user?.[0]?.address?.map((address, index) => (
                  <div
                    key={address._id}
                    className="gap-5 flex justify-center items-center  flex-wrap"
                  >
                    <input
                      type="radio"
                      name="address"
                      value={index}
                      checked={selectedAddressIndex === index}
                      onChange={() => handleAddressChange(index)}
                    />
                    <span className="shadow m-2 p-4 rounded-xl">
                      <li className="ml-4 font-semibold list-none">
                        Street: <span>{address.street}</span>
                      </li>
                      <li className="ml-4 font-semibold list-none">
                        City: <span>{address.city}</span>
                      </li>
                      <li className="ml-4 font-semibold list-none">
                        Country: <span>{address.country}</span>
                      </li>
                      <li className="ml-4 font-semibold list-none">
                        Postal Code: <span>{address.postalCode}</span>
                      </li>
                      <li className="ml-4 font-semibold list-none">
                        State: <span>{address.state}</span>
                      </li>
                    </span>
                    <Button label={<PencilLine />} />
                    <Button label={<Trash />} />
                  </div>
                ))}

                {/* <button onClick={openModal}>Add Address</button> */}

                {showModal && (
                  <div className="modal backdrop-blur-lg fixed top-0 left-0 w-full h-full flex justify-center items-center">
                    <div className="modal-content flex  justify-center items-center gap-20 bg-white p-4 rounded-xl">
                      <span
                        className="close cursor-pointer bg-neutral-300 rounded-full p-2 flex justify-center items-center text-3xl w-fit"
                        onClick={closeModal}
                      >
                        &times;
                      </span>
                      <h3>Add New Address</h3>
                      <form>
                        <InputBox
                          LabelName="Street"
                          Placeholder="Enter street address"
                          Name="street"
                          Value={newAddress.street}
                          onChange={handleAddressInputChange}
                        />
                        <InputBox
                          LabelName="City"
                          Placeholder="Enter city"
                          Name="city"
                          Value={newAddress.city}
                          onChange={handleAddressInputChange}
                        />
                        <InputBox
                          LabelName="Country"
                          Placeholder="Enter country"
                          Name="country"
                          Value={newAddress.country}
                          onChange={handleAddressInputChange}
                        />
                        <InputBox
                          LabelName="Postal Code"
                          Placeholder="Enter postal code"
                          Name="postalCode"
                          Value={newAddress.postalCode}
                          onChange={handleAddressInputChange}
                        />
                        <InputBox
                          LabelName="State"
                          Placeholder="Enter state"
                          Name="state"
                          Value={newAddress.state}
                          onChange={handleAddressInputChange}
                        />
                        <Button
                          type="button"
                          onClick={addAddress}
                          label="Add Address"
                          className="mt-4"
                        />
                      </form>
                      {error && <p className="text-red-500">{error}</p>}
                    </div>
                  </div>
                )}
                {showModal2 && (
                  <div className=" fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-lg">
                    <h1 className="mb-5">
                      Hello{" "}
                      <span className="text-2xl font-bold ">
                        {user?.[0]?.name}
                      </span>{" "}
                      you can edit your account details here
                    </h1>
                    <div className="flex justify-center items-center gap-10 w-1/2 rounded-xl shadow py-10 whiteSoftBG">
                      <div className="w-1/2">
                        <form ref={fromRef} onSubmit={handleEditProfileSubmit}>
                          <InputBox
                            LabelName="Name"
                            Placeholder="Name"
                            Name="name"
                            Value={editProfile.name}
                            Type="name"
                            onChange={handleAddressInputChange2}
                          />
                          <InputBox
                            LabelName="Email Address"
                            Placeholder="Email Address"
                            Name="email"
                            Value={editProfile.email}
                            Type="email"
                            onChange={handleAddressInputChange2}
                          />
                          <InputBox
                            LabelName="Contact Number"
                            Placeholder="Contact Number"
                            Name="phoneNumber"
                            Type="number"
                            Value={editProfile.phoneNumber}
                            onChange={handleAddressInputChange2}
                          />
                          <InputBox
                            LabelName="Password"
                            Placeholder="Password"
                            Name="password"
                            Value={editProfile.password}
                            Type="password"
                            onChange={handleAddressInputChange2}
                          />
                          <Button
                            type="submit"
                            label="Update Profile"
                            className="mt-4"
                          />
                        </form>
                      </div>
                      <div className="flex flex-col gap-5">
                        <Button
                          type="button"
                          onClick={closeModal2}
                          label="Cancel"
                          className="mt-4 hover:bg-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
          {activeSection === "orders" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Orders</h2>
              <div className="flex justify-start items-start gap-5 flex-wrap p-5 ">
                {console.log(allOrders)}
                {allOrders?.map((product, index) => (
                  <ProductCard
                    key={index}
                    ProductName={product?.products?.[0]?.product?.name}
                    CurrentPrice={product?.products?.[0]?.product?.price}
                    Mrp={product?.products?.[0]?.product?.price}
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
              {/* {console.log(wishlistProducts)} */}
              <div className="flex justify-start items-start gap-5 flex-wrap p-5">
                {wishlistProducts?.map((product, index) => (
                  <ProductCard
                    key={index}
                    ProductName={product?.name}
                    CurrentPrice={product?.price}
                    Mrp={product?.price}
                    Rating={product?.Rating}
                    Offer={product?.off}
                    Description={product?.description}
                    productId={product?._id}
                    className={`hidden lg:block`}
                  />
                ))}
              </div>
              <div className="flex justify-start items-start gap-5 flex-wrap lg:hidden">
                {wishlistProducts?.map((product, index) => (
                  <ProductCardMobile
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
              </div>
            </section>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
