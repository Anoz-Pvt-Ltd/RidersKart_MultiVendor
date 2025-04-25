import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import ProductCard from "../../Components/ProductCard";
import Button from "../../Components/Button";
import ProductCardMobile from "../../Components/ProductCardMobile";
import LoadingUI from "../../Components/Loading";
import {
  addQuantity,
  deleteFromCart,
  resetCart,
  subtractQuantity,
} from "../../Utility/Slice/CartSlice";
import { useDebounce } from "../../Utility/Utility-functions";
import { useNavigate } from "react-router";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";

const CartPage = ({ startLoading, stopLoading }) => {
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);
  const cart = useSelector((store) => store.CartList.cart);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const productFormatter = (products) => {
    return products.map((product) => {
      return {
        product: product.product._id,
        quantity: product.quantity,
        price: product.product.price,
      };
    });
  };

  const HandleBuyNow = async () => {
    const products = productFormatter(cart);
    console.log("products", products);
    try {
      startLoading();

      // Ensure all required fields are included
      const response = await FetchData(`orders/create-order`, "post", {
        userId: user[0]._id,
        products,
        // shippingAddress: addresses[selectedAddress],
        totalAmount: (getTotalPayablePrice() * 1.1).toFixed(2),
      });
      console.log(response);
      stopLoading();
      // alert(response.data.message);
      localStorage.setItem("orderId", response.data.data._id);
      return response.data.data._id;
    } catch (err) {
      // console.log(err);
      alert(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };
  
  const OrderConfirmation = async (orderId) => {
    // const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      alert("Failed to find orderId. Please try again.");
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
        alert("Order confirmed successfully!");
        dispatch(resetCart());
        Navigate("/"); // Redirect to orders page after confirmation
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const OnlinePayment = async (e) => {
    const orderId = await HandleBuyNow();

    if (!orderId) {
      alert("Failed to create order. Please try again.");
      return;
    }

    const order = await FetchData("payment/create-new-paymentId", "post", {
      options: {
        // amount: (getTotalPayablePrice() * 1.1).toFixed(2),
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
          alert("Payment Failed");
        } else if (isValidated.status === 201) {
          alert("Payment Successful");

          OrderConfirmation(orderId);
          setPaymentMethod("done");
        }
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
    e.preventDefault();
  };


  const HandleCashOnDelivery = async (e) => {
    e.preventDefault();
    if (!selectedAddress || !paymentMethod) {
      alert("Please select an address and payment method.");
      return;
    }

    const orderId = await HandleBuyNow();
    if (!orderId) {
      alert("Failed to create order. Please try again.");
      return;
    }
    OrderConfirmation(orderId);
    Navigate("/");
  };

  useEffect(() => {
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

    // fetchCartProducts();
    fetchUserAddresses();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-products", "get");
        if (response.data.success) {
          setProducts(response.data.data.products);
        } else {
          setError("Failed to load products.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        stopLoading();
      }
    };
    fetchProducts();
  }, []);

  // console.log(cart?.[0]?.quantity);

  const removeFromCart = async (productId) => {
    try {
      startLoading();
      console.log("productId", productId);
      console.log("user", user[0]._id);
      const response = await FetchData(
        `users/${user[0]._id}/${productId}/cart/remove`,
        "delete"
      );
      console.log(response);

      alert(response.data.message);
      dispatch(deleteFromCart(productId));
    } catch (err) {
      console.log(err);
      // alert(
      //   err.response?.data?.message ||
      //     "Failed to remove product from cart. Please try again."
      // );
    } finally {
      stopLoading();
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      startLoading();
      const response = await FetchData(
        `users/${productId}/cart/edit-quantity`,
        "post",
        { quantity }
      );
      console.log(response);
      alert("Quantity updated successfully");
    } catch (err) {
      console.log(err);
      // alert(
      //   err.response?.data?.message ||
      //     "Failed to update quantity. Please try again."
      // );
    } finally {
      stopLoading();
    }
  };

  const handelAddQuantity = useDebounce(updateQuantity, 1000);

  function getTotalPayablePrice() {
    return cart.reduce((total, item) => {
      if (!item.product) return total;
      return total + item.product.price.sellingPrice * item.quantity;
    }, 0);
  }

  console.log(cart);
  // console.log(cart[0]?._id);
  // console.log(cart[0]?.product?.vendor);
  const HandleHome = () => {
    Navigate("/");
  };

  // console.log("products", productFormatter(cart));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="flex flex-col w-full gap-4 justify-between items-center">
          <div className="flex flex-col lg:flex-row w-full justify-around items-start ">
            <div className="lg:col-span-2 lg:w-3/4 w-full">
              <div className="bg-white shadow-md rounded-md p-4 h-[30rem] overflow-y-scroll ">
                {cart?.map((item) =>
                  item?.product === null ? (
                    <div key={item?._id}></div>
                  ) : (
                    <div
                      key={item?._id}
                      className="flex flex-col gap-5 md:flex-row items-center justify-between border-b pb-4 mb-4"
                    >
                      <div className="grid grid-cols-5 grid-rows-5 gap-4 w-full rounded">
                        <div className="col-span-2 row-span-4 ">
                          <div className="flex justify-center items-center w-full h-full rounded">
                            <img
                              src={item?.product?.images[0].url}
                              alt={item?.product?.name}
                              className="w-40 object-cover rounded shadow-lg shadow-neutral-600 "
                            />
                          </div>
                        </div>
                        <div className="col-span-5 col-start-1 row-start-5 w-full">
                          <div className="flex justify-evenly items-center gap-5">
                            <span className="text-sm line-through">
                              MRP: ₹ {item?.product?.price.MRP}
                            </span>
                            <span className="font-semibold">
                              Current price: ₹
                              {item?.product?.price.sellingPrice}
                            </span>
                            <span className="text-green-500 font-semibold">
                              {item?.product?.price.discount}%off
                            </span>
                          </div>
                        </div>
                        <div className="col-span-3 col-start-3 row-start-1 w-full border rounded-xl shadow-xl shadow-neutral-300">
                          <h2 className="font-medium text-2xl px-5 w-full h-full flex items-center">
                            {item?.product?.name}
                          </h2>
                        </div>
                        <div className="col-span-3 col-start-3 row-start-2  w-full">
                          <h2 className="text-sm w-full h-full flex items-center truncate">
                            {/* Seller name: {item?.product?.name} */}
                            Description: {item?.product?.description}
                          </h2>
                        </div>
                        <div className="col-span-2 col-start-4 row-start-4  w-full">
                          <div className="w-full h-full flex items-center justify-center ">
                            <Button
                              onClick={() => removeFromCart(item?.product?._id)}
                              label="Remove"
                              className="bg-white hover:bg-orange-500 hover:text-white w-full"
                            />
                          </div>
                        </div>
                        <div className="col-start-3 row-start-4 w-full">
                          <div className="flex items-center justify-center gap-2 w-full h-full">
                            <button
                              onClick={() => {
                                dispatch(subtractQuantity(item?.product?._id));
                                handelAddQuantity(
                                  item?.product?._id,
                                  item?.quantity - 1
                                );
                              }}
                              className="px-2 flex justify-center items-center bg-gray-200 rounded-full"
                            >
                              -
                            </button>
                            <span>{item?.quantity}</span>
                            <button
                              onClick={() => {
                                dispatch(addQuantity(item?.product?._id));
                                handelAddQuantity(
                                  item?.product?._id,
                                  item?.quantity + 1
                                );
                              }}
                              className="px-2 flex justify-center items-center bg-gray-200 rounded-full"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-span-3 col-start-3 row-start-3  w-full ">
                          <div className="flex justify-evenly items-center gap-5 w-full h-full text-xl">
                            <span>Total Quantity: {item?.quantity}</span>
                            <span>
                              Total value: ₹
                              {item?.product?.price.sellingPrice *
                                item?.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Order summery */}
            <div className="lg:w-1/3 w-full  flex flex-col justify-center items-center lg:p-10 lg:pt-0 gap-5">
              <div className="bg-white shadow-md rounded-md p-4 w-full">
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
              </div>
              <div className="addresses w-full">
                <h2 className="mb-5 font-semibold">Select Shipping Address</h2>
                {addresses?.length > 0 ? (
                  <select
                    value={selectedAddress}
                    onChange={handleAddressChange}
                    className="bg-white border border-neutral-400 p-5 rounded-xl outline-none w-full"
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
              <div className=" w-full">
                <h2 className="mb-5 font-semibold">Select Payment Method</h2>
                <select
                  value={paymentMethod}
                  onChange={handlePaymentChange}
                  className="bg-white border border-neutral-400 p-5 rounded-xl outline-none w-full"
                >
                  <option value="" disabled>
                    Select a payment method
                  </option>
                  <option value="online">Online</option>
                  <option value="cash">Cash on delivery</option>
                </select>
                {paymentMethod === "online" && (
                  <Button
                    className={`mt-5 bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                    onClick={OnlinePayment}
                    label={"Proceed for payment"}
                  />
                )}
                {paymentMethod === "cash" && (
                  <Button
                    className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black mt-10`}
                    onClick={HandleCashOnDelivery}
                    Disabled={!selectedAddress || !paymentMethod}
                    label={"Place order"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}

      <h1 className="text-xl mx-4 my-10 w-full text-center border-t border-neutral-400 font-bold">
        Recommendations
      </h1>
      {products.length === 0 ? (
        <div>
          <h1>No Recommendations available </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-4 bg-transparent justify-start items-center overflow-x-auto p-5 w-full no-scrollbar">
            {products?.map((product) => (
              <ProductCard
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
                className={`hidden lg:block`}
              />
            ))}
          </div>
          <div className="flex lg:hidden flex-col gap-4 bg-transparent justify-start items-center overflow-x-auto w-full">
            {products?.map((product) => (
              <ProductCardMobile
                key={product._id}
                Image={product?.images[0]?.url}
                ProductName={product.name}
                CurrentPrice={product.price.sellingPrice}
                Mrp={product.price.MRP}
                Rating={product.rating || "No rating"}
                Offer="No offer"
                Category={product.category.main}
                StockQuantity={product.stockQuantity}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingUI(CartPage);
