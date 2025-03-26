import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";

const BuyNow = ({ startLoading, stopLoading }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [productVendor, setProductVendor] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((store) => store.UserInfo.user);
  const [addAmount, setAddAmount] = useState("");

  const Navigate = useNavigate();
  const HandleHome = () => {
    Navigate("/");
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (user?.length > 0) {
        startLoading();
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
        } finally {
          stopLoading();
        }
      }
    };

    const fetchUserAddresses = async () => {
      if (user?.length > 0) {
        startLoading();
        try {
          const response = await FetchData(
            `users/${user?.[0]?._id}/addresses`,
            "get"
          );
          console.log(response);
          setAddresses(response.data);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch addresses.");
        } finally {
          stopLoading();
        }
      }
    };

    const fetchVendorByProductId = async () => {
      if (user?.length > 0) {
        startLoading();
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
        } finally {
          stopLoading();
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
      startLoading();
      const quantity = 1;

      // Ensure all required fields are included
      const response = await FetchData(
        `users/book-product/${user?.[0]?._id}/${product?._id}/${productVendor?._id}`,
        "post",
        {
          quantity,
          paymentMethod,
          shippingAddress: addresses[selectedAddress],
          orderStatus: "booked", // Ensure this is a valid enum value in your model
        }
      );
      // console.log(response);

      if (response.data.success) {
        alert("Order placed successfully!");
        HandleHome();
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order.");
    } finally {
      stopLoading();
    }
  };

  const Payment = async (e) => {
    const order = await FetchData("payment/create-new-paymentId", "post", {
      options: {
        amount: 100,
        currency: "INR",
        receipt: "qwerty1234",
      },
    });

    console.log(order);

   var options = {
     key: process.env.razorpay_key_id, // Enter the Key ID generated from the Dashboard
     order_id: order.data.data.id, // ✅ Correct key for order-based payments
     name: "Acme Corp.",
     description: "Monthly Test Plan",
     image: "/Logo.png",
     handler: async function (response) {
       console.log(response); // Check response

       const body = {
         ...response,
         amount: order.data.data.amount, // Pass correct amount
         paymentMethod: "UPI",
       };

       const isValidated = await FetchData(
         "payment/validate-payment",
         "post",
         body
       );

       if (isValidated.status === 450) {
         alert("Payment Failed");
       } else if (isValidated.status === 201) {
         alert("Payment Successful");
       }
     },
   };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
    e.preventDefault();
  };

  return (
    <div className="buy-now-page flex flex-col lg:flex-row justify-center items-center gap-20 mt-10">
      {product && (
        <div className="w-fit">
          <ProductCard
            Image={product?.images[0]?.url}
            ProductName={product?.name}
            Description={product?.description}
            productId={product?._id}
            CurrentPrice={product?.price.sellingPrice}
            Mrp={product?.price.MRP}
          />
        </div>
      )}

      <div className="address-selection flex flex-col gap-5 justify-evenly items-center">
        <div>
          <h1 className="font-semibold text-2xl">Hello, {user?.[0]?.name}</h1>
        </div>
        <div className="w-4/5  border">
          <h2 className="mb-5 font-semibold">Select Shipping Address</h2>
          {addresses?.length > 0 ? (
            <select
              value={selectedAddress}
              onChange={handleAddressChange}
              className="bg-gray-400 p-5 rounded-xl outline-none w-full"
            >
              <option value="" selected disabled>
                Select an address
              </option>
              {addresses?.map((address, index) => (
                <option
                  key={address?._id}
                  value={index}
                  className="bg-white max-w-40"
                >
                  {`${address?.street}, ${address?.city}, ${address?.state}, ${address?.country}, ${address?.postalCode}`}
                </option>
              ))}
            </select>
          ) : (
            <p>No addresses available. Please add one in your profile.</p>
          )}
        </div>
        <div className="w-4/5">
          <h2 className="mb-5 font-semibold">Select Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={handlePaymentChange}
            className="bg-gray-400 p-5 rounded-xl outline-none w-full"
          >
            <option value="" disabled>
              Select a payment method
            </option>
            <option value="online">Online</option>
            <option value="card">Cash on delivery</option>
          </select>
          {paymentMethod === "online" && (
            <Button
              className={`mt-5 bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
              onClick={Payment}
              label={"Proceed to payment"}
            />
          )}
        </div>
      </div>

      <Button
        className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
        onClick={handleBuyNow}
        Disabled={!selectedAddress || !paymentMethod}
        label={"Proceed to Checkout"}
      />
    </div>
  );
};

export default LoadingUI(BuyNow);
