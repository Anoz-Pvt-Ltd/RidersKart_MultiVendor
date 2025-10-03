import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utility/FetchFromApi";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { Check, ChevronDown, MoveRight } from "lucide-react";
import InputBox from "../../Components/InputBox";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";
import { alertError, alertInfo, alertSuccess } from "../../Utility/Alert";
import {
  truncateNumber,
  truncateString,
} from "../../Utility/Utility-functions";
import { Card } from "../../Components/ProductCard";
import { PinCodeData } from "../../Constants/PinCodeData";
import { all } from "axios";
import { FilterByPincode } from "../../Utility/FilterByPincode";

const BuyNow = ({ startLoading, stopLoading }) => {
  const { productId, orderId } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState("");
  const [addressPopUp, setAddressPopUp] = useState(false);
  const user = useSelector((store) => store.UserInfo.user);
  const userPostalCode = user[0]?.defaultAddress?.postalCode;
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  const handleLogin = () => {
    Navigate("/login");
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
          setAddresses(response.data);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch addresses.");
        } finally {
          stopLoading();
        }
      }
    };
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-products", "get");
        let allProducts = response.data.data.products;

        const allowedProducts = allProducts.filter(
          (product) => !product.status || product.status === "active"
        );

        // further filter products based on pincode
        const filtered = FilterByPincode(
          allowedProducts,
          userPostalCode,
          PinCodeData
        );
        setProducts(filtered);
        // setProducts(response.data.data.products);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };

    fetchProductDetails();
    fetchUserAddresses();
    fetchProducts();
  }, [productId, user]);

  // const handleAddressChange = (e) => {
  //   setSelectedAddress(e.target.value);
  // };

  useEffect(() => {
    if (user?.[0]?.defaultAddress) {
      const defaultAddr = `${
        user?.[0]?.defaultAddress?.street || "Not available"
      }, ${user?.[0]?.defaultAddress?.city || "Not available"}, ${
        user?.[0]?.defaultAddress?.state || "Not available"
      }, ${user?.[0]?.defaultAddress?.country || "Not available"}, ${
        user?.[0]?.defaultAddress?.postalCode || "Not available"
      }`;

      setSelectedAddress(defaultAddr);
    }
  }, [user]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleOrderConfirmation = async () => {
    if (!selectedAddress || !paymentMethod) {
      alertInfo("Please select address and payment method.");
      return;
    }
    try {
      startLoading();
      const response = await FetchData("orders/update-order-status", "post", {
        orderId,
        status: "confirmed",
        address: user?.[0]?.defaultAddress,
      });
      if (response.status === 200) {
        alertSuccess("Order confirmed successfully!");
        Navigate("/"); // Redirect to orders page after confirmation
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alertError("Failed to confirm order. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const Payment = async (e) => {
    const order = await FetchData("payment/create-new-paymentId", "post", {
      options: {
        // amount: product?.price.MRP,
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
          orderId: orderId,
        };

        const isValidated = await FetchData(
          "payment/validate-payment",
          "post",
          body
        );

        if (isValidated.status === 450) {
          alertError("Payment Failed");
        } else if (isValidated.status === 201) {
          alertSuccess("Payment Successful");
          handleOrderConfirmation();
          setPaymentMethod("done");
        }
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
    e.preventDefault();
  };

  const makeDefaultAddress = async (addressId) => {
    try {
      startLoading();
      await FetchData(
        `users/${user?.[0]?._id}/addresses/${addressId}/set-default-address`,
        "post"
      );
      alertSuccess("Default address set successfully");
      // Set flag in localStorage
      window.location.reload();
      setAddressPopUp(false);
    } catch (err) {
      alertError(
        err.response?.data?.message || "Failed to set default address."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      {user === null || user.length === 0 ? (
        <div className="">
          <div className="flex w-full">
            <section className="login_or_register text-black flex flex-col  items-center justify-center ">
              <h1 className="w-full text-center text-2xl font-medium font-serif  txt-green  ">
                You are not Logged in
              </h1>
              <h1 className="w-full text-center text-xl font-light font-Caveat  text-black ">
                Kindly Login Or Register.
              </h1>
            </section>
          </div>
          <Button label={"Login"} onclick={handleLogin} />
        </div>
      ) : (
        <div className="buy-now-page flex flex-col lg:flex-row justify-center items-center lg:py-10 h-full gap-20">
          {product && (
            <div>
              <div className="whiteSoftBG shadow-md hover:shadow-lg h-full w-fit overflow-hidden rounded-lg duration-300 ease-in-out flex justify-evenly items-center flex-col lg:flex-row">
                <div className="overflow-hidden  object-center flex justify-center items-center">
                  <img
                    src={product?.images[0].url}
                    alt="No Image found"
                    className="lg:w-64 lg:h-52 w-24 h-24 object-contain"
                  />
                </div>
                <div className="px-2 flex flex-col">
                  <Link
                    to={`/current-product/${product?._id}`}
                    className=" font-semibold truncate hover:text-blue-500 hover:underline duration-200 ease-in-out"
                  >
                    Product Name: {truncateString(product?.name, 20)}
                  </Link>
                  <p>Description: {truncateString(product?.description, 30)}</p>
                  <div className="flex flex-col w-full justify-center items-start ">
                    <h1 className="">
                      Current price: ₹{product?.price.sellingPrice}
                    </h1>
                    <h1 className=" line-through text-gray-500 text-xs">
                      {" "}
                      MRP:
                      {truncateNumber(product?.price.MRP, 3)}
                    </h1>
                    <h1 className=" bg-green-500 p-1 rounded text-xs truncate">
                      Discount: {product?.price.discount}% off
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="address-selection flex flex-col gap-5 justify-evenly items-center">
            {/* address area  */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.2,
              }}
              className="addresses w-full"
            >
              <h1 className="mb-5 font-semibold flex justify-evenly items-center ">
                Selected Default Address{" "}
                <span>
                  <button
                    className="text-sm font-light text-blue-500 hover:underline"
                    onClick={() => setAddressPopUp(true)}
                  >
                    Change Shipping Address
                  </button>
                </span>
              </h1>
              {addresses?.length > 0 ? (
                <div>
                  <select
                    disabled
                    value={selectedAddress}
                    // onChange={handleAddressChange}
                    className="bg-white border border-neutral-400 p-2 rounded-xl outline-none w-full cursor-not-allowed"
                  >
                    <option value={selectedAddress}>{selectedAddress}</option>
                    {/* <option value={selectedAddress}>{selectedAddress}</option> */}

                    {/* If later you want to add other addresses, you can uncomment this */}
                    {/* {addresses?.map((address, index) => (
          <option
            key={address?._id}
            value={`${address?.street}, ${address?.city}, ${address?.state}, ${address?.country}, ${address?.postalCode}`}
          >
            {`${address?.street}, ${address?.city}, ${address?.state}, ${address?.country}, ${address?.postalCode}`}
          </option>
        ))} */}
                  </select>
                  {user?.[0]?.defaultAddress?.coordinates.length === 0 ? (
                    <h1 className="w-96 text-red-500 text-xs">
                      ! Please provide exact location to avoid calls from
                      Delivery partner.
                    </h1>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <p>No addresses available. Please add one in your profile.</p>
              )}
              {/* <select value={selectedAddress}>
                <strong>Default address:</strong>{" "}
                <h1 className="">
                  <p className="shadow rounded-xl bg-neutral-200 py-2 px-3 w-fit">
                    <li className=" font-semibold list-none">
                      Street:{" "}
                      <span className="font-normal ">
                        {truncateString(
                          user?.[0]?.defaultAddress?.street || "Not available",
                          20
                        )}
                        ,
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      City:{" "}
                      <span className="font-normal ">
                        {user?.[0]?.defaultAddress?.city || "Not available"},
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Country:{" "}
                      <span className="font-normal ">
                        {user?.[0]?.defaultAddress?.country || "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      Postal Code:{" "}
                      <span className="font-normal ">
                        {user?.[0]?.defaultAddress?.postalCode ||
                          "Not available"}
                      </span>
                    </li>
                    <li className=" font-semibold list-none">
                      State:{" "}
                      <span className="font-normal ">
                        {user?.[0]?.defaultAddress?.state || "Not available"}
                      </span>
                    </li>
                  </p>
                </h1>
              </select> */}
            </motion.div>
            {/* payment method  */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.4,
              }}
              className=" w-full"
            >
              <h2 className="mb-5 font-semibold">Select Payment Method</h2>
              <select
                value={paymentMethod}
                onChange={handlePaymentChange}
                className="bg-white border border-neutral-400 p-2 rounded-xl outline-none w-full"
              >
                <option value="" disabled selected>
                  Select a payment method
                </option>
                <option value="online">Online</option>
                <option value="cash">Cash on delivery</option>
              </select>
              {paymentMethod === "online" && (
                <Button
                  className={`  mt-5 w-full`}
                  onClick={Payment}
                  label={"Proceed for payment"}
                />
              )}
              {paymentMethod === "cash" && (
                <Button
                  className={`  mt-5 w-full`}
                  onClick={handleOrderConfirmation}
                  label={"Place order"}
                />
              )}
            </motion.div>
          </div>
        </div>
      )}
      <div className="pb-20">
        <h1 className="px-10 bg-neutral-200 text-center py-4 flex justify-center items-center gap-5">
          People also bought <ChevronDown className="h-4 w-4" />
        </h1>
        <div className="flex gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 max-w-full">
          {products?.map((product) => (
            <Card
              Image={product?.images[0]?.url}
              key={product._id}
              ProductName={product.name}
              CurrentPrice={product.price.sellingPrice}
              Mrp={product.price.MRP}
              Rating={product.Rating}
              Offer={product.off}
              Description={product.description}
              productId={product._id}
              Discount={product.price.discount}
              Stock={product.stockQuantity}
            />
          ))}
        </div>
      </div>
      {addressPopUp && (
        <div className="fixed top-0 left-0 py-5 w-full h-screen overflow-scroll bg-neutral-200 flex justify-center items-center">
          {console.log("Hello")}
          <div className="flex lg:flex-row flex-col flex-wrap justify-start items-center ">
            {user?.[0]?.address?.map((address, index) => (
              <div
                key={address._id}
                className="gap-5 flex justify-center items-center flex-row flex-wrap w-full lg:w-fit"
              >
                <span className="shadow m-1 py-3 px-2 rounded-xl bg-neutral-200 w-full lg:w-fit">
                  <li className=" font-semibold list-none">
                    Street:{" "}
                    <span className="font-normal  ">
                      {truncateString(address?.street || "Not available")}
                    </span>
                  </li>
                  <li className=" font-semibold list-none">
                    City:{" "}
                    <span className="font-normal  ">
                      {address?.city || "Not available"}
                    </span>
                  </li>
                  <li className=" font-semibold list-none">
                    Country:{" "}
                    <span className="font-normal  ">
                      {address?.country || "Not available"}
                    </span>
                  </li>
                  <li className=" font-semibold list-none">
                    Postal Code:{" "}
                    <span className="font-normal  ">
                      {address?.postalCode || "Not available"}
                    </span>
                  </li>
                  <li className=" font-semibold list-none">
                    State:{" "}
                    <span className="font-normal  ">
                      {address?.state || "Not available"}
                    </span>
                  </li>
                  <div className="flex justify-evenly items-center gap-5 pt-2">
                    <button
                      className="flex justify-center items-center gap-2 hover:text-red-500 "
                      onClick={() => makeDefaultAddress(address?._id)}
                    >
                      <Check className="h-4 w-4 border-black border rounded-full" />
                      <span>Mark as Default</span>
                    </button>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingUI(BuyNow);
