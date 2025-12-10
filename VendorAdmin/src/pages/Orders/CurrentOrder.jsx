import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import InputBox from "../../components/InputBox";

const CurrentOrder = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [orderProducts, setOrderProducts] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);
  const userId = currentOrder?.user;
  const [handlePopup, setHandlePopup] = useState({
    markAsConfirmed: false,
    markAsReadyForShipment: false,
    markAsShipped: false,
    cancelOrderPopup: false,
  });
  const navigate = useNavigate();
  const getCurrentOrder = async () => {
    try {
      const response = await FetchData(
        `orders/get-current-order/${orderId}`,
        "get"
      );
      //   console.log(response);
      setCurrentOrder(response.data.data.order);
      setOrderProducts(response.data.data.order.products);
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    getCurrentOrder();
  }, [user]);

  const getCurrentClient = async () => {
    try {
      const response = await FetchData(
        `users/admin/get-current-user/${userId}`,
        "get"
      );
      //   console.log(response);
      setCurrentUser(response.data.data.user);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    getCurrentClient();
  }, [userId]);

  // console.log(currentOrder);

  const ProductsCard = ({
    images,
    productName,
    description,
    sp,
    mrp,
    discount,
    quantity,
  }) => {
    return (
      <div className="flex lg:flex-row flex-col justify-start lg:items-center items-start bg-white shadow-md rounded-lg p-5 lg:mb-5 mb-2 lg:mx-5 w-full lg:w-[45vw] lg:gap-5 overflow-hidden truncate">
        <div className="flex justify-between items-center">
          <div className="lg:w-48 lg:h-48 w-24 h-24 shadow overflow-hidden flex justify-center items-center rounded-lg object-center">
            <img src={images} className="" />
          </div>
        </div>
        <div className="w-full flex flex-col lg:justify-start justify-center items-start">
          <div>
            <div className="py-1 flex flex-col justify-center items-start lg:gap-5 ">
              <h1 className="lg:text-base text-sm truncate">
                <strong>Name:</strong> {productName}
              </h1>
            </div>
            <div className="py-1 flex flex-col justify-center items-start lg:gap-5 ">
              <h1 className="lg:text-base text-sm truncate">
                <strong>Description: </strong>
                {description}
              </h1>
            </div>
            <div className="py-1 flex flex-col justify-center items-start lg:gap-5 ">
              <h1 className="lg:text-base text-sm truncate">
                <strong>Selling Price</strong>: ₹ {sp}{" "}
                <span className="bg-green-300 px-2 py-1 rounded-full text-xs">
                  {discount}%off
                </span>
              </h1>
            </div>
            <div className="py-1 flex flex-col justify-center items-start lg:gap-5 ">
              <h1 className="lg:text-base text-sm truncate">
                <strong>MRP:</strong> ₹ {mrp}
              </h1>
            </div>
            <div className="py-1 flex flex-col justify-center items-start lg:gap-5 ">
              <h1 className="lg:text-base text-sm truncate">
                <strong>Quantity:</strong> {quantity}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const statusMarkAsConfirmed = () => {
    try {
      const response = FetchData(
        `orders/mark-order-as-confirm/${currentOrder?._id}`,
        "post"
      );
      console.log(response);
      alert("Order marked as confirmed");
      getCurrentOrder();
      setHandlePopup((prev) => {
        return { ...prev, markAsConfirmed: false };
      });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const MarkAsReadyForPickup = () => {
    try {
      const response = FetchData(
        `orders/mark-order-as-ready-for-shipment/${currentOrder?._id}`,
        "post"
      );
      console.log(response);
      alert("Order marked as ready for shipment");
      getCurrentOrder();
      setHandlePopup((prev) => {
        return { ...prev, markAsShipped: false };
      });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const markAsShipped = () => {
    try {
      const response = FetchData(
        `orders/mark-order-as-shipped/${currentOrder?._id}`,
        "post"
      );
      console.log(response);
      alert("Order marked as Shipped");
      getCurrentOrder();
      setHandlePopup((prev) => {
        // alert("Order has been canceled");
        return { ...prev, cancelOrderPopup: false };
      });
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const markAsCancel = () => {
    try {
      const response = FetchData(
        `orders/cancel-order/${currentOrder?._id}`,
        "post"
      );
      console.log(response);
      alert("Order marked as Cancelled");
      getCurrentOrder();
      setHandlePopup((prev) => {
        // alert("Order has been canceled");
        return { ...prev, cancelOrderPopup: false };
      });
      // navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-center gap-40 px-5 py-5 items-center bg-gray-100">
        <h1 className="text-2xl uppercase">Order overview </h1>
        <div className="flex flex-col justify-center items-start gap-5 ">
          {currentOrder?.orderStatus === "pending" ? (
            <div className="bg-gray-300 rounded-xl flex justify-between items-start gap-2 px-10 py-5 w-full">
              <h1 className="w-96">
                Kindly confirm the User that Order has been confirmed from your
                end, click here to confirm.
              </h1>
              <Button
                label="Mark order as Confirm"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsConfirmed: true };
                  })
                }
              />
            </div>
          ) : (
            ""
          )}
          {currentOrder?.orderStatus === "confirmed" ? (
            <div className="bg-gray-300 rounded-xl flex justify-between items-start gap-2 px-10 py-5 w-full">
              <h1 className="w-96">
                If product is ready for shipment, click here to confirm.
              </h1>
              <Button
                label="Mark ready for Shipment"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsReadyForShipment: true };
                  })
                }
              />
            </div>
          ) : (
            ""
          )}
          {currentOrder?.orderStatus === "readyForShipment" ? (
            <div className="bg-gray-300 rounded-xl flex justify-between items-start gap-2 px-10 py-5 w-full">
              <h1 className="w-96">
                If product is picked up delivery partner, click here to confirm.
              </h1>
              <Button
                label="Mark Order as Shipped"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsShipped: true };
                  })
                }
              />
            </div>
          ) : (
            ""
          )}
          {currentOrder?.orderStatus === "shipped" ? (
            <div className="bg-gray-300 rounded-xl flex justify-between items-start gap-2 px-10 py-5 w-full">
              <h1 className="w-96">
                Your order has been shipped successfully. when the delivery
                partner successfully delivers the order to the customer, the
                order status will be updated to "Delivered".
              </h1>
              {/* <Button
                label="Mark Order as Shipped"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsShipped: true };
                  })
                }
              /> */}
            </div>
          ) : (
            ""
          )}
          {currentOrder?.orderStatus === "pending" ? (
            <div className="bg-gray-300 rounded-xl flex justify-between items-start gap-2 px-10 py-5 w-full">
              <h1 className="w-96">
                If you want to cancel the order, click here to confirm.
              </h1>
              <Button
                label="Cancel Order"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, cancelOrderPopup: true };
                  })
                }
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex lg:flex-row flex-col justify-center items-start bg-neutral-100 w-full lg:py-10 py-0">
        <div className="flex justify-center items-start flex-col lg:px-20 lg:pb-10 lg:py-0 lg:gap-5 gap-2 py-10">
          <div className="flex flex-col justify-start items-start lg:w-fit w-full lg:px-10 px-2 py-5 rounded-xl bg-neutral-200 text-sm">
            <p className="text-center w-full my-5 bg-[#DF3F33] text-white py-2 rounded-full uppercase tracking-widest">
              Order Details
            </p>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Amount</strong>: <p>₹ {currentOrder?.totalAmount}</p>
            </h1>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Order Status</strong>:{" "}
              <p className="capitalize">{currentOrder?.orderStatus}</p>
            </h1>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Payment Method</strong>:{" "}
              <p className="uppercase">{currentOrder?.paymentMethod}</p>
            </h1>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Payment Status</strong>:{" "}
              {/* <p>{currentOrder?.paymentStatus}</p> */}
              <h1>
                {currentOrder?.paymentStatus === "pending" ? (
                  <h1 className="bg-yellow-100 w-fit px-2 py-1 rounded-xl text-yellow-600">
                    Pending
                  </h1>
                ) : (
                  <h1 className="bg-green-100 w-fit px-2 py-1 rounded-xl text-green-600">
                    Complete
                  </h1>
                )}
              </h1>
            </h1>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Order Created on (MMDDYY): </strong>
              <p>{new Date(currentOrder?.bookingDate).toLocaleDateString()}</p>
              <p>{new Date(currentOrder?.bookingDate).toLocaleTimeString()}</p>
            </h1>
            <h1 className="flex justify-center items-start flex-col bg-neutral-300 py-4 px-2 rounded-xl">
              <strong>Shipping Address :</strong>
              <p>Street: {currentOrder?.shippingAddress?.street}</p>
              <p>City: {currentOrder?.shippingAddress?.city}</p>
              <p>State: {currentOrder?.shippingAddress?.state}</p>
              <p>Postal Code: {currentOrder?.shippingAddress?.postalCode}</p>
            </h1>
          </div>
          <div className="flex flex-col justify-start items-start lg:w-fit w-full lg:px-10 px-2 py-5 rounded-xl bg-neutral-200 text-sm">
            <p className="text-center w-full my-5 bg-[#DF3F33] text-white py-2 rounded-full uppercase tracking-widest">
              Client Details
            </p>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Name</strong>: <p>{currentUser?.name}</p>
            </h1>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Contact number</strong>: <p>{currentUser?.phoneNumber}</p>
            </h1>
            <h1 className="flex justify-center items-center gap-1 lg:text-nowrap">
              <strong>Email</strong>: <p>{currentUser?.email}</p>
            </h1>
          </div>
        </div>
        <div className="w-full lg:px-20 flex flex-col justify-center items-center gap-4 bg-neutral-300 rounded-xl">
          <p className="text-center w-full my-5 bg-[#DF3F33] text-white py-2 rounded-full uppercase tracking-widest">
            Product details
          </p>
          <h1>Total Products: {orderProducts?.length}</h1>
          {orderProducts?.map((product, index) => (
            <ProductsCard
              key={index}
              productId={product?.product?._id}
              productName={product?.product?.name}
              description={product?.product?.description}
              images={product?.product?.images[0]?.url}
              mrp={product?.price?.MRP}
              discount={product?.price?.discount}
              sp={product?.price?.sellingPrice}
              quantity={product?.quantity}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {handlePopup.markAsConfirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-neutral-200 flex-col px-10 "
          >
            <h1 className="w-3/4 text-center py-5">
              This action will mark Order as Confirmed from your end, after
              marking as confirmed you cannot cancel the order directly, You
              will be needing to contact support for cancelling.
            </h1>
            <div className="flex justify-center items-center gap-5 ">
              <Button
                label="Mark as Confirmed"
                onClick={() => statusMarkAsConfirmed()}
              />
              <Button
                label="Cancel"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsConfirmed: false };
                  })
                }
              />
            </div>
          </motion.div>
        )}
        {handlePopup.markAsReadyForShipment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-neutral-200 flex-col px-10 "
          >
            <h1 className="w-3/4 text-center py-5">
              This action mark ORDER as READY FOR SHIPMENT from your end, after
              marking as ready for shipment our partner will pick up the order
              for delivery.
            </h1>
            <div className="flex justify-center items-center gap-5 ">
              <Button
                label="Mark as Ready for Shipment"
                onClick={() => MarkAsReadyForPickup()}
              />
              <Button
                label="Cancel"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsReadyForShipment: false };
                  })
                }
              />
            </div>
          </motion.div>
        )}
        {handlePopup.markAsShipped && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-neutral-200 flex-col px-10 "
          >
            <h1>This action mark ORDER as SHIPPED from your end</h1>
            <div className="flex justify-center items-center gap-5 ">
              <Button label="Mark as Shipped" onClick={() => markAsShipped()} />
              <Button
                label="Cancel"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, markAsShipped: false };
                  })
                }
              />
            </div>
          </motion.div>
        )}
        {handlePopup.cancelOrderPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-neutral-200 flex-col px-10"
          >
            <div className="flex flex-col justify-center items-center gap-5 lg:w-96 ">
              <h1>This action will cancel the order from your end</h1>
              <InputBox LabelName={"Reason to cancel order"} />
            </div>
            <div className="flex justify-center items-center gap-5 ">
              <Button label="Mark as Cancel" onClick={() => markAsCancel()} />
              <Button
                label="Cancel"
                onClick={() =>
                  setHandlePopup((prev) => {
                    return { ...prev, cancelOrderPopup: false };
                  })
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrentOrder;
//"pending",
//"confirmed",
//"shipped",
//"delivered",
//"cancelled",
//"booked",
