import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import Button from "../../Components/Button";

const BuyNow = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [productVendor, setProductVendor] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((store) => store.UserInfo.user);
  const Navigate = useNavigate();
  const HandleHome = () => {
    Navigate("/");
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `products/get-single-product/${productId}`,
            "get"
          );
          if (response.data.success) {
            setProduct(response.data.data);
          } else {
            setError("Failed to load product details.");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch product details."
          );
        }
      }
    };

    const fetchUserAddresses = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `users/${user?.[0]?._id}/addresses`,
            "get"
          );
          if (response.statusText === "OK") {
            setAddresses(response.data);
          } else {
            setError("Failed to load addresses.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch addresses.");
        }
      }
    };

    const fetchVendorByProductId = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `vendor/get-vendor-by-product-id/${productId}`,
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setProductVendor(response.data.data);
          } else {
            setError("Failed to load vendor details.");
          }
        } catch (err) {
          console.log(err);
          setError(
            err.response?.data?.message || "Failed to fetch vendor details."
          );
        }
      }
    };
    fetchProductDetails();
    fetchUserAddresses();
    fetchVendorByProductId();
  }, [productId, user]);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  // console.log(product);
  const handleBuyNow = async () => {
    try {
      const quantity = 1;

      // Ensure all required fields are included
      const response = await FetchData(
        `users/book-product/${user?.[0]?._id}/${product?._id}/${productVendor?._id}`,
        "post",
        {
          quantity,
          addressId: selectedAddress,
          paymentMethod,
          shippingAddress: {
            postalCode: "12345",
            country: "CountryName",
            state: "StateName",
            city: "CityName",
            street: "StreetName",
          },
          orderStatus: "booked", // Ensure this is a valid enum value in your model
        }
      );
      console.log(response);

      if (response.data.success) {
        alert("Order placed successfully!");
        HandleHome();
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order.");
    }
  };

  return (
    <div className="buy-now-page flex justify-center items-center gap-20">
      {product && (
        <div className="w-fit">
          <ProductCard
            ProductName={product?.name}
            Description={product?.description}
            productId={product?._id}
            CurrentPrice={product?.price}
            Mrp={product?.mrp}
          />
        </div>
      )}

      <div className="address-selection flex flex-col gap-5 justify-evenly items-center">
        <div>
          <h1 className="font-semibold text-2xl">Hello, {user?.[0]?.name}</h1>
        </div>
        <div>
          <h2 className="mb-5 font-semibold">Select Shipping Address</h2>
          {addresses?.length > 0 ? (
            <select
              value={selectedAddress}
              onChange={handleAddressChange}
              className="bg-gray-400 p-5 rounded-xl outline-none"
            >
              <option value="" disabled>
                Select an address
              </option>
              {addresses?.map((address) => (
                <option
                  key={address?._id}
                  value={address?._id}
                  className="bg-white"
                >
                  {`${address?.street}, ${address?.city}, ${address?.state}, ${address?.country}, ${address?.postalCode}`}
                </option>
              ))}
            </select>
          ) : (
            <p>No addresses available. Please add one in your profile.</p>
          )}
        </div>
        <div className="w-full">
          <h2 className="mb-5 font-semibold">Select Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={handlePaymentChange}
            className="bg-gray-400 p-5 rounded-xl outline-none w-full"
          >
            <option value="" disabled>
              Select a payment method
            </option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
      </div>

      <Button
        onClick={handleBuyNow}
        Disabled={!selectedAddress || !paymentMethod}
        label={"Proceed to Checkout"}
      />
    </div>
  );
};

export default BuyNow;
