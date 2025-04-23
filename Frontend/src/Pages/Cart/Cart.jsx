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
  subtractQuantity,
} from "../../Utility/Slice/CartSlice";
import { useDebounce } from "../../Utility/Utility-functions";
import { useNavigate } from "react-router";

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
  const Payment = async (e) => {
    const order = await FetchData("payment/create-new-paymentId", "post", {
      options: {
        amount: (getTotalPayablePrice() * 1.1).toFixed(2),
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        startLoading();
        const response = await FetchData("products/get-all-product", "get");
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

  useEffect(() => {
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
  console.log(cart[0]?._id);
  console.log(cart[0]?.product?.vendor);
  const HandleHome = () => {
    Navigate("/");
  };

  const handleBuyNow = async () => {
    try {
      startLoading();
      const quantity = 1;

      // Ensure all required fields are included
      const response = await FetchData(
        `users/book-product/${user?.[0]?._id}/${cart[0]?.product?._id}/${cart[0]?.product?.vendor}`,
        "post",
        {
          quantity,
          paymentMethod,
          shippingAddress: addresses[selectedAddress],
          orderStatus: "confirmed", // Ensure this is a valid enum value in your model
        }
      );
      console.log(response);

      if (response.data.success) {
        alert("Order placed successfully!");
        HandleHome();
        // cart.deleteFromCart();
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to place order.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="flex flex-col w-full gap-4 justify-between items-center">
          <div className="flex flex-col lg:flex-row w-full justify-around items-start ">
            <div className="lg:col-span-2 lg:w-1/2 w-full  border">
              <div className="bg-white shadow-md rounded-md p-4 h-96 overflow-y-scroll">
                {cart?.map((item) =>
                  item?.product === null ? (
                    <div key={item?._id}></div>
                  ) : (
                    <div
                      key={item?._id}
                      className="flex flex-col gap-5 md:flex-row items-center justify-between border-b pb-4 mb-4"
                    >
                      <div className="flex justify-between gap-10 mt-5 w-full  ">
                        <div className="w-20 h-20 flex justify-center items-center">
                          <img
                            src={item?.product?.images[0].url}
                            alt={item?.product?.name}
                            className="w-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 px-4">
                          <h2 className="font-medium text-lg">
                            {item?.product?.name}
                          </h2>
                          <p className="text-gray-600">
                            ₹ {item?.product?.price.sellingPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-10 ">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              dispatch(subtractQuantity(item?.product?._id));
                              handelAddQuantity(
                                item?.product?._id,
                                item?.quantity - 1
                              );
                            }}
                            className="px-2 py-1 bg-gray-200 rounded"
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
                            className="px-2 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium">
                          ₹ {item?.product?.price.sellingPrice * item?.quantity}
                        </p>
                      </div>
                      <Button
                        onClick={() => removeFromCart(item?.product?._id)}
                        label="Remove"
                        className="bg-white hover:bg-orange-500 hover:text-white"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Order summery */}
            <div className="lg:w-1/2 w-full  flex flex-col justify-center items-center lg:p-10 lg:pt-0 gap-5">
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
                {/* <Button
                  label={"Proceed to Checkout"}
                  className="bg-white hover:bg-orange-500 hover:text-white"
                /> */}
              </div>
              <div className="addresses">
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
                    onClick={Payment}
                    label={"Proceed for payment"}
                  />
                )}
                {paymentMethod === "cash" && (
                  <Button
                    className={` bg-white text-blue-600 hover:bg-green-500 hover:text-black`}
                    onClick={handleBuyNow}
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
