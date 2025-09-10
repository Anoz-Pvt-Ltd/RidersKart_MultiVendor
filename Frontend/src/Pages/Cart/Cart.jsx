import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
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
import { CheckOutCard } from "../../Components/ProductCard";
import { Trash } from "lucide-react";
import { alertError, alertInfo, alertSuccess } from "../../Utility/Alert";

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
    try {
      startLoading();

      // Ensure all required fields are included
      const response = await FetchData(`orders/create-order`, "post", {
        userId: user[0]._id,
        products,
        // shippingAddress: addresses[selectedAddress],
        totalAmount: (getTotalPayablePrice() * 1.1).toFixed(2),
      });
      stopLoading();
      // alert(response.data.message);
      localStorage.setItem("orderId", response.data.data._id);
      return response.data.data._id;
    } catch (err) {
      alertError(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  const OrderConfirmation = async (orderId) => {
    // const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      alertError("Failed to find orderId. Please try again.");
      return;
    }
    try {
      startLoading();
      const response = await FetchData("orders/update-order-status", "post", {
        orderId,
        status: "confirmed",
        address: addresses[selectedAddress],
      });
      if (response.status === 200) {
        alertSuccess("Order confirmed successfully!");
        dispatch(resetCart());
        Navigate("/"); // Redirect to orders page after confirmation
      }
    } catch (error) {
      alertError("Failed to confirm order. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const OnlinePayment = async (e) => {
    const orderId = await HandleBuyNow();

    if (!orderId) {
      alertError("Failed to create order. Please try again.");
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

    var options = {
      key: process.env.razorpay_key_id, // Enter the Key ID generated from the Dashboard
      order_id: order.data.data.id, // ✅ Correct key for order-based payments
      name: "Acme Corp.",
      description: "Monthly Test Plan",
      image: "/Logo.png",
      handler: async function (response) {
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
      alertInfo("Please select an address and payment method.");
      return;
    }

    const orderId = await HandleBuyNow();
    if (!orderId) {
      alertError("Failed to create order. Please try again.");
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

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       startLoading();
  //       const response = await FetchData("products/get-all-products", "get");
  //       if (response.data.success) {
  //         setProducts(response.data.data.products);
  //       } else {
  //         setError("Failed to load products.");
  //       }
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to fetch products.");
  //     } finally {
  //       stopLoading();
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  const removeFromCart = async (productId) => {
    try {
      startLoading();
      const response = await FetchData(
        `users/${user[0]._id}/${productId}/cart/remove`,
        "delete"
      );

      alertSuccess(response.data.message);
      dispatch(deleteFromCart(productId));
    } catch (err) {
      alertError(err.response?.data?.message);
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
      alertSuccess("Quantity updated successfully");
    } catch (err) {
      alertError(err.response?.data?.message);
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
  const HandleHome = () => {
    Navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Your Cart</h1> */}

      {cart.length > 0 ? (
        <div className="flex flex-col w-full gap-4 justify-between items-center">
          <div className="flex flex-col lg:flex-row w-full justify-center items-center ">
            <div className="lg:col-span-2 lg:w-3/4 w-full ">
              <div className="bg-neutral-300 no-scrollbar shadow-md rounded-md lg:p-4 p-1 lg:h-[30rem] overflow-y-scroll ">
                {cart?.map((item) =>
                  item?.product === null ? (
                    <div key={item?._id}></div>
                  ) : (
                    <div className="w-full flex justify-center items-center lg:my-4 my-1">
                      <CheckOutCard
                        Image={item?.product?.images[0].url}
                        key={item?._id}
                        ProductName={item?.product.name}
                        CurrentPrice={item?.product.price.sellingPrice}
                        Mrp={item?.product.price.MRP}
                        Rating={item?.product.Rating}
                        Offer={item?.product.off}
                        Description={item?.product.description}
                        productId={item?.product._id}
                        Discount={item?.product.price.discount}
                        Stock={item?.product.stockQuantity}
                        CartFunctionalities={
                          <div className="w-full h-full flex lg:flex-col flex-row items-center justify-evenly lg:px-5 lg:gap-2">
                            <span className="w-full">
                              Quantity: {item?.quantity}
                            </span>
                            <span className="w-full">
                              Total: ₹
                              {item?.product?.price.sellingPrice *
                                item?.quantity}
                            </span>
                            <div className="flex items-center justify-center gap-2 w-full h-full">
                              <button
                                onClick={() => {
                                  dispatch(
                                    subtractQuantity(item?.product?._id)
                                  );
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
                            <Button
                              onClick={() => removeFromCart(item?.product?._id)}
                              label={
                                <div className="flex justify-center items-center ">
                                  <h1 className="text-xs flex justify-center items-center gap-1">
                                    <Trash className="h-3 w-3" />
                                    <span className="hidden lg:flex">
                                      Remove
                                    </span>
                                  </h1>
                                </div>
                              }
                              className=" hover:bg-orange-500  lg:w-full"
                            />
                          </div>
                        }
                      />
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-center items-center w-full ">
                <Button
                  label={"Shop more"}
                  onClick={HandleHome}
                  className={`text-xs lg:text-base lg:w-fit w-full my-4`}
                />
              </div>
            </div>

            {/* Order summery */}
            <div className="lg:w-1/3 w-full flex flex-col justify-center items-center lg:p-10 lg:pt-0 gap-5">
              {/* order summary  */}
              <div className="bg-white shadow-md rounded-md p-4 w-full text-sm lg:text-base">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>₹ {getTotalPayablePrice()}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>₹ {(getTotalPayablePrice() * 0.1).toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>₹ {(getTotalPayablePrice() * 1.1).toFixed(2)}</p>
                </div>
              </div>
              {/* address area  */}
              <div className="addresses w-full">
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
              </div>
              {/* payment method  */}
              <div className=" w-full">
                <h2 className="mb-5 font-semibold">Select Payment Method</h2>
                <select
                  value={paymentMethod}
                  onChange={handlePaymentChange}
                  className="bg-white border border-neutral-400 p-2 rounded-xl outline-none w-full"
                >
                  <option value="" disabled>
                    Select a payment method
                  </option>
                  <option value="online">Online</option>
                  <option value="cash">Cash on delivery</option>
                </select>
                {paymentMethod === "online" && (
                  <Button
                    className={` hover:bg-green-500 hover:text-black mt-5 w-full`}
                    onClick={OnlinePayment}
                    label={"Proceed for payment"}
                  />
                )}
                {paymentMethod != "online" && (
                  <Button
                    className={` hover:bg-green-500 hover:text-black mt-5 w-full`}
                    onClick={HandleCashOnDelivery}
                    label={"Place order"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <img
            src={`https://ik.imagekit.io/RiderKart/no%20item%20in%20the%20shopping%20cart,%20click%20to%20go%20shopping%20now%20concept%20illustration%20flat%20design%20vector%20eps10_%20modern%20graphic%20element%20for%20landing%20page,%20empty%20state%20ui,%20infographic,%20icon.jpeg?updatedAt=1747207669157`}
            alt="Empty Cart"
            className="lg:w-1/4 lg:mx-auto"
          />
          <h1 className="text-2xl mb-6">Your Cart is Empty</h1>
          <h1>Add products to cart to proceed checkout.</h1>
          <Button
            className={` hover:bg-green-500 hover:text-black`}
            onClick={HandleHome}
            label={"Go to Home"}
          />
        </div>
      )}
      {/* 
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
      )} */}
    </div>
  );
};

export default LoadingUI(CartPage);
