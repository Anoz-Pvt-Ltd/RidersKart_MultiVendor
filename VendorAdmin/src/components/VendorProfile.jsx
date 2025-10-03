import React, { useState, useEffect } from "react";
import { FetchData } from "../utils/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingUI from "./Loading";

const VendorProfile = ({ startLoading, stopLoading }) => {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((store) => store.UserInfo.user);
  const [VendorProduct, setVendorProducts] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `vendor/vendor-profile/${user?.[0]?._id}`,
            "get"
          );
          console.log(response);
          setVendor(response.data.data);
        } catch (err) {
          setError("Failed to load vendor profile.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchVendor();
  }, [vendor]);

  const fetchProducts = async () => {
    if (user.length > 0) {
      try {
        const response = await FetchData(
          `products/get-all-product-of-vendor/${user?.[0]?._id}`,
          "get"
        );
        if (response.data.success) setVendorProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="lg:p-6 rounded-lg shadow-md bg-neutral-200 h-screen overflow-scroll">
      {/* Profile Header */}
      <div className="flex gap-4 justify-evenly items-center border-b-2 pb-5 lg:hidden">
        <Button label="Home" onClick={handleHome} />
        {/* <Button label="Edit Profile" /> */}
      </div>
      {/* vendor name and location section  */}
      <div className="flex flex-col lg:flex-row justify-between w-full lg:gap-10 gap-5 h-fit ">
        {/* vendor name section  */}
        <motion.div
          className="flex items-center justify-between bg-white lg:w-1/2 rounded-xl px-4 py-2 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <img
              src="/path-to-user-profile-image.jpg" // Replace with the actual path to the user's image
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{user?.[0]?.name}</h1>
              <p className="text-gray-500">{user?.[0]?.email}</p>
              <p className="text-gray-500">
                <strong>Contact:</strong> {user?.[0]?.contactNumber}
              </p>
            </div>
          </div>
          <div className="lg:flex gap-4 hidden ">
            <Button label="Home" onClick={handleHome} />
            {/* <Button label="Edit Profile" onClick={handleHome} /> */}
          </div>
        </motion.div>

        {/* Address and Location Section */}
        <motion.div
          className="bg-white lg:w-1/2 rounded-xl px-4 py-2 text-sm flex justify-between items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="font-semibold mb-2 text-base">Location </h2>
            <p>
              <strong>Street: </strong>
              {user?.[0]?.location.address}
            </p>
            <p className="">
              <strong>City: </strong>
              {user?.[0]?.location.city}, <br />
              <strong>State: </strong> {user?.[0]?.location.state}, <br />
              <strong>Country: </strong>
              {user?.[0]?.location.country} <br />
              <strong>Postal Code: </strong>
              {user?.[0]?.location.postalCode}
            </p>
          </div>
          <Button label="Edit Address" className="text-base" />
        </motion.div>
      </div>
      {/* Business Details and Bank Details */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="border p-4 rounded-lg bg-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-2">Business Details</h2>
            <p>
              <strong>Business Name:</strong>{" "}
              {user?.[0]?.businessDetails?.businessName}
            </p>
            <p>
              <strong>GST Number:</strong>{" "}
              {user?.[0]?.businessDetails?.gstNumber}
            </p>
            <p>
              <strong>Registered On:</strong>{" "}
              {new Date(
                user?.[0]?.businessDetails?.registrationDate
              ).toLocaleDateString()}
            </p>
          </div>
          <Button label="Edit Details" />
        </div>
        <div className="border p-4 rounded-xl bg-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bank Details</h2>
            <p>
              <strong>Account Holder:</strong>{" "}
              {user?.[0]?.bankDetails?.accountHolderName}
            </p>
            <p>
              <strong>Account Number:</strong>{" "}
              {user?.[0]?.bankDetails?.accountNumber}
            </p>
            <p>
              <strong>Bank Name:</strong> {user?.[0]?.bankDetails?.bankName}
            </p>
            <p>
              <strong>IFSC Code:</strong> {user?.[0]?.bankDetails?.ifscCode}
            </p>
          </div>
          <Button label="Edit Details" />
        </div>
      </motion.div>
      {/* rating and account status  */}
      <div className="flex flex-col lg:flex-row justify-between w-full lg:gap-10 gap-5 h-fit my-5">
        {/* Ratings Section */}
        <motion.div
          className="flex flex-col items-start justify-between bg-white lg:w-1/2 rounded-xl px-4 py-2 "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-2">Ratings</h2>
          <p>
            <strong>Average Rating:</strong> {user?.[0]?.ratings?.average}/5
          </p>
          <p>
            <strong>Total Reviews:</strong> {user?.[0]?.ratings?.reviewsCount}
          </p>
        </motion.div>

        {/* Account Status */}
        <motion.div
          className="flex flex-col items-start  justify-between bg-white lg:w-1/2 rounded-xl px-4 py-2 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h2 className="text-lg font-semibold mb-2">Account Status</h2>
          <p className="uppercase bg-green-300 px-3 py-1 tracking-widest font-semibold text-green-800 rounded-2xl">
            {user?.[0]?.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user?.[0]?.createdAt).toLocaleDateString()}
          </p>
          {/* <p>
          <strong>Updated At:</strong>{" "}
          {new Date(user?.[0]?.updatedAt).toLocaleDateString()}
        </p> */}
        </motion.div>
      </div>

      {/* Products Section */}
      <motion.div
        className="border p-4 rounded-lg shadow mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-lg font-semibold mb-2">
          Total Registered Products: {VendorProduct?.length}
        </h2>
        {VendorProduct?.length > 0 ? (
          <ul className="list-disc list-inside">
            {VendorProduct.map((product) => (
              <li key={product?._id}>{product?.name}</li>
            ))}
          </ul>
        ) : (
          <p>No products listed.</p>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingUI(VendorProfile);
