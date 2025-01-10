import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import InputBox from "../../Components/InputBox";
import ProductCard from "../../Components/ProductCard";
import { Heart, ListOrdered, Newspaper, User } from "lucide-react";

const Dashboard = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [cartProducts, setWishlistProducts] = useState();
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    country: "",
    postalCode: "",
    state: "",
  });

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
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

  return (
    <div className="flex min-h-screen">
      <motion.aside
        className="w-64 text-black p-4 shadow-lg"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <nav>
          <ul>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("profile")}
            >
              {<User />}Profile
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("orders")}
            >
              {<ListOrdered />}Orders
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "coupons"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("coupons")}
            >
              {<Newspaper />}Available Coupons
            </li>
            <li
              className={`p-4 rounded-md cursor-pointer transition-all duration-300 ${
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
              <div className="flex w-full justify-evenly items-center mb-20 shadow py-10 rounded-xl">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Profile</h2>
                  <p>Name: {user?.[0]?.name}</p>
                  <p>Email: {user?.[0]?.email}</p>
                  <p>Email: {user?.[0]?.phoneNumber}</p>
                </div>
                <div className="flex justify-evenly items-center gap-5">
                  <Button onClick={openModal} label={"Add Address"} />
                  <Button label={"Edit Profile"} />
                  {/* <Button label={"Add Address"} /> */}
                </div>
              </div>
              <div className="flex ">
                <p className="m-10 font-bold text-xl">
                  Select a Default Address:
                </p>
                {user?.[0]?.address?.map((address, index) => (
                  <div
                    key={address._id}
                    className="gap-5 flex justify-center items-center  "
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
                  </div>
                ))}

                {/* <button onClick={openModal}>Add Address</button> */}

                {showModal && (
                  <div className="modal bg-neutral-400 fixed top-0 left-0 w-full h-full flex justify-center items-center">
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
              </div>
            </section>
          )}
          {activeSection === "orders" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Orders</h2>
              {/* Orders content */}
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
                <span>{cartProducts?.length} items.</span>
              </h1>
              {/* {console.log(cartProducts)} */}
              <div className="flex justify-start items-start gap-5 flex-wrap p-5 ">
                {cartProducts?.map((product, index) => (
                  <ProductCard
                    key={index}
                    ProductName={product?.name}
                    CurrentPrice={product?.price}
                    Mrp={product?.price}
                    Rating={product?.Rating}
                    Offer={product?.off}
                    Description={product?.description}
                    productId={product?._id}
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
