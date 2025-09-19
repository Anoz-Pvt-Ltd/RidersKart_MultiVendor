import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utility/FetchFromApi";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { ChevronDown, MoveRight } from "lucide-react";
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
  const user = useSelector((store) => store.UserInfo.user);
  const userPostalCode = user[0]?.address?.[0]?.postalCode;
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  console.log(products);

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

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

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
        address: addresses[selectedAddress],
      });
      console.log(response);
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

  const Login = () => {
    const NavigateRegister = () => {
      Navigate("/register");
    };

    const formRef = useRef(null);
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      startLoading(); // Start loading when login button is clicked

      try {
        const response = await FetchData("users/login", "post", formData);
        console.log(response);
        localStorage.clear(); // will clear the all the data from localStorage
        localStorage.setItem(
          "AccessToken",
          response.data.data.tokens.AccessToken
        );
        localStorage.setItem(
          "RefreshToken",
          response.data.data.tokens.RefreshToken
        );

        alertSuccess(response.data.message);
        Dispatch(clearUser());
        Dispatch(addUser(response.data.data.user));
        setSuccess("Login successful!");
        Navigate(`/checkout/${productId}/${user?._id}`);
      } catch (err) {
        console.log(err);
        // alert(parseErrorMessage(error.response.data.data.statusCode));
        alertError(parseErrorMessage(err.response.data));
      } finally {
        stopLoading(); // Stop loading once response is received
      }
    };

    return (
      <div>
        <section className="flex lg:m-28 lg:border rounded-lg lg:shadow-md lg:shadow-neutral-300 lg:h-96 my-20">
          <div className="lg:w-1/2 p-10 rounded-lg rounded-r-none headerBg text-white hidden lg:block">
            <h1 className="text-4xl h-3/4 text-white font-semibold">
              Login with your e-mail to get started !
            </h1>
            <h1 className="flex justify-around items-center">
              If you are not registered with us create your new account here{" "}
              <MoveRight />
            </h1>
          </div>
          <div className=" lg:w-1/2 w-full flex justify-center items-center flex-col lg:whiteSoftBG">
            <form
              ref={formRef}
              className="login h-3/4 flex justify-top items-top flex-col w-3/4"
            >
              <InputBox
                onChange={handleChange}
                LabelName={"Login"}
                Placeholder={"Email Address"}
                Type={"email"}
                className={"w-full"}
                Name={"email"}
                Value={formData.email}
              />
              <InputBox
                onChange={handleChange}
                LabelName={"Password"}
                Placeholder={"Password"}
                Type={"password"}
                className={"w-full"}
                Name={"password"}
                Value={formData.password}
              />
              {/* <InputBox
              LabelName={"Login"}
              Placeholder={"Your Mobile Number"}
              Type={"number"}
              className={"w-full"}
            /> */}
              <Button
                className={`w-full`}
                label={"Login"}
                onClick={handleSubmit}
              />
            </form>
            <div className="w-full h-full justify-center items-center flex flex-col mt-20 lg:mt-0">
              <Button
                label={"Register Here"}
                onClick={NavigateRegister}
                className={`w-1/2 `}
              />
              <p className="text-xs text-neutral-500 text-center">
                ** By continuing, you agree to our Terms of Use and Privacy
                Policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // function getTotalPayablePrice() {
  //   return product.map((total, item) => {
  //     if (!item.product) return total;
  //     return total + item.product.price.sellingPrice * item.quantity;
  //   }, 0);
  // }
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
          <Login />
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
              <h2 className="mb-5 font-semibold">Select Shipping Address</h2>
              {addresses?.length > 0 ? (
                <select
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  className="bg-white border border-neutral-400 p-2 rounded-xl outline-none w-full"
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
    </div>
  );
};

export default LoadingUI(BuyNow);
