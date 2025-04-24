import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utility/FetchFromApi";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../Components/ProductCard";
import Button from "../../Components/Button";
import LoadingUI from "../../Components/Loading";
import { MoveRight } from "lucide-react";
import InputBox from "../../Components/InputBox";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";

const BuyNow = ({ startLoading, stopLoading }) => {
  const { productId, orderId } = useParams();
  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState("");
  const user = useSelector((store) => store.UserInfo.user);

  const Navigate = useNavigate();
  const Dispatch = useDispatch();

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

    fetchProductDetails();
    fetchUserAddresses();
  }, [productId, user]);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleOrderConfirmation = async () => {
    if (!selectedAddress || !paymentMethod) {
      alert("Please select address and payment method.");
      return;
    }
    try {
      startLoading()
      const response = await FetchData("orders/update-order-status", "post", {
        orderId,
        status: "confirmed",
        address: addresses[selectedAddress],
      });
      console.log(response);
      if (response.status === 200) {
        alert("Order confirmed successfully!");
        Navigate("/"); // Redirect to orders page after confirmation
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const Payment = async (e) => {
    const order = await FetchData("payment/create-new-paymentId", "post", {
      options: {
        amount: product?.price.MRP,
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
          alert("Payment Failed");
        } else if (isValidated.status === 201) {
          alert("Payment Successful");
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

        alert(response.data.message);
        Dispatch(clearUser());
        Dispatch(addUser(response.data.data.user));
        setSuccess("Login successful!");
        Navigate(`/checkout/${productId}/${user?._id}`);
      } catch (err) {
        console.log(err);
        // alert(parseErrorMessage(error.response.data.data.statusCode));
        alert(parseErrorMessage(err.response.data));
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
                className={`w-full bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                label={"Login"}
                onClick={handleSubmit}
              />
            </form>
            <div className="w-full h-full justify-center items-center flex flex-col mt-20 lg:mt-0">
              <Button
                label={"Register Here"}
                onClick={NavigateRegister}
                className={`w-1/2 hover:bg-green-500 bg-white text-blue-600  hover:text-black`}
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
        <div className="buy-now-page flex flex-col lg:flex-row justify-center items-center gap-20 mt-10 h-full">
          {product && (
            <div className="w-fit px-10">
              <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full rounded-lg  px-5 py-6 shadow-lg shadow-neutral-300">
                <div className="col-span-2 row-span-4 ">
                  <div className="flex justify-center items-center w-full h-full rounded">
                    <img
                      src={product?.images[0].url}
                      alt={product?.name}
                      className=" object-cover rounded shadow-lg shadow-neutral-600 "
                    />
                  </div>
                </div>
                <div className="col-span-3 col-start-3 row-start-1 w-full border rounded-xl shadow-xl shadow-neutral-300">
                  <h2 className="font-medium text-2xl px-5 w-full h-full flex items-center">
                    {product?.name}
                  </h2>
                </div>
                <div className="col-span-3 col-start-3 row-start-2  w-full">
                  <h2 className="text-sm w-full h-full flex items-center truncate">
                    {/* Seller name: {item?.product?.name} */}
                    Description: {product?.description}
                  </h2>
                </div>
                <div className="col-span-3 col-start-3 row-start-3  w-full ">
                  <div className="flex justify-evenly items-center gap-5">
                    <span className="text-sm line-through">
                      MRP: ₹ {product?.price.MRP}
                    </span>
                    <span className="font-semibold">
                      Current price: ₹{product?.price.sellingPrice}
                    </span>
                    <span className="text-green-500 font-semibold">
                      {product?.price.discount}%off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="address-selection flex flex-col gap-5 justify-evenly items-center">
            <div>
              <h1 className="font-semibold text-2xl">
                Hello, {user?.[0]?.name}
              </h1>
            </div>
            <div className="w-4/5 ">
              <h2 className="mb-5 font-semibold">Select Shipping Address</h2>
              {addresses?.length > 0 ? (
                <select
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  className="bg-white p-5 rounded-xl outline-none w-full shadow-xl border"
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
                className="bg-white p-5 rounded-xl outline-none w-full shadow-xl border"
              >
                <option value="" disabled selected>
                  Select a payment method
                </option>
                <option value="online">Online</option>
                <option value="cash">Cash on delivery</option>
              </select>
            </div>
            {paymentMethod === "online" && (
              <Button
                className={`mt-5 bg-white text-blue-600 hover:bg-green-500 hover:text-black w-3/4`}
                onClick={Payment}
                label={"Proceed for payment"}
              />
            )}
            {paymentMethod === "cash" && (
              <Button
                className={`w-3/4 bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                onClick={handleOrderConfirmation}
                // Disabled={!selectedAddress || !paymentMethod}
                label={"Place order"}
              />
            )}
          </div>

          {/* <div className="bg-white shadow-md rounded-md p-4 w-full">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>₹ {getTotalPayablePrice()}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Tax</p>
              <p>₹ {(getTotalPayablePrice() * 0.1).toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold mb-4">
              <p>Total</p>
              <p>₹ {(getTotalPayablePrice() * 1.1).toFixed(2)}</p>
            </div>
          </div> */}

          {/* <Button
            className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
            onClick={handleOrderConfirmation}
            // Disabled={!selectedAddress || !paymentMethod}
            label={"Place order"}
          /> */}
        </div>
      )}
    </div>
  );
};

export default LoadingUI(BuyNow);
