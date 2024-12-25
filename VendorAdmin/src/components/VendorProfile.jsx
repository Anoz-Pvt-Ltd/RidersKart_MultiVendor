import React, { useState, useEffect } from "react";
import { FetchData } from "../utils/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const VendorProfile = ( _id ) => {
  const [vendor, setVendor] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);
  const [VendorProduct, setVendorProducts] = useState(null);
  console.log(user?.[0]?._id);

  const fetchProducts = async () => {
    try {
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      // console.log(response);
      if (response.data.success) setVendorProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // setLoading(true);
        const response = await FetchData(
          `vendor/vendor-profile/${user?.[0]?._id}`,
          "get"
        );
        setVendor(response.data.data);
        // console.log(response);
      } catch (err) {
        setError("Failed to load vendor profile.");
      } finally {
        // setLoading(false);
      }
    };

    fetchVendor();
  }, [vendor]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="my-10 flex justify-center items-center gap-10">
        <Button label={"Home"} onClick={handleHome} />
        <Button label={"Edit Profile"} onClick={handleHome} />
      </div>
      <div className=" shadow px-5 py-10 border border-neutral-200 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{user?.[0]?.name}</h1>
        <p>
          <strong>Email:</strong> {user?.[0]?.email}
        </p>
        <p>
          <strong>Contact Number:</strong> {user?.[0]?.contactNumber}
        </p>
      </div>
      <div className="mt-4  shadow px-5 py-10 border border-neutral-200 rounded-lg">
        <h2 className="text-lg font-semibold">Location</h2>
        <p>{user?.[0]?.location.address}</p>
        <p>
          {user?.[0]?.location.city}, {user?.[0]?.location.state},{" "}
          {user?.[0]?.location.country} - {user?.[0]?.location.postalCode}
        </p>
      </div>

      <div className="flex  shadow px-5 py-10 border border-neutral-200 rounded-lg mt-4 justify-evenly items-center ">
        <div>
          <h2 className="text-lg font-semibold">Business Details</h2>
          <p>
            <strong>Business Name:</strong>{" "}
            {user?.[0]?.businessDetails?.businessName}
          </p>
          <p>
            <strong>GST Number:</strong> {user?.[0]?.businessDetails?.gstNumber}
          </p>
          <p>
            <strong>Registered On:</strong>{" "}
            {new Date(
              user?.[0]?.businessDetails?.registrationDate
            ).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bank Details</h2>
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
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Ratings</h2>
        <p>
          <strong>Average Rating:</strong> {user?.[0]?.ratings?.average}/5
        </p>
        <p>
          <strong>Total Reviews:</strong> {user?.[0]?.ratings?.reviewsCount}
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">
          Total registered products : {VendorProduct?.length}
        </h2>
        {VendorProduct?.length > 0 ? (
          <ul className="list-disc list-inside">
            {VendorProduct?.map((product) => (
              <li key={product?._id}>{product?.name}</li>
            ))}
          </ul>
        ) : (
          <p>No products listed.</p>
        )}
      </div>

      <div className="flex justify-evenly items-center  shadow px-5 py-10 border border-neutral-200 rounded-lg mt-4">
        <div>
          <h2 className="text-lg font-semibold">Account Status</h2>
          <p>{user?.[0]?.status}</p>
        </div>
        <div>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user?.[0]?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(user?.[0]?.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
