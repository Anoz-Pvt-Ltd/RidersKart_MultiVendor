import React, { useEffect, useState } from "react";
import LoadingUI from "../../Components/Loading";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";
import { ArrowDownToLine } from "lucide-react";
import { alertError, alertSuccess } from "../../Utility/Alert";
import { parseErrorMessage } from "../../Utility/ErrorMessageParser";
import { motion, AnimatePresence } from "framer-motion";

const CurrentOrder = ({ startLoading, stopLoading }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState([]);
  console.log(order);
  const [orderProducts, setOrderProducts] = useState([]);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);
  const Navigate = useNavigate();
  const [handlePopup, setHandlePopup] = useState({
    cancelOrderPopup: false,
  });

  const fetchOrder = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(
          `orders/admin/current-order/${orderId}`,
          "get"
        );
        // console.log(response);
        if (response.data.success) {
          setOrder(response.data.data.order);
          setOrderProducts(response.data.data.order.products);
          setShippingAddress(response.data.data.order.shippingAddress);
        } else {
          setError("Failed to load orders.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        stopLoading();
      }
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [user]);
  const markAsCancel = () => {
    try {
      const response = FetchData(
        `orders/cancel-order-by-user/${orderId}`,
        "post"
      );
      console.log(response);
      alert("Order marked as Cancelled");
      fetchOrder();
      setHandlePopup((prev) => {
        return { ...prev, cancelOrderPopup: false };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const ProductsCard = ({
    productId,
    productName,
    sellerName,
    orderAmount,
    paymentMethod,
    images,
    ratings = [],
    userId,
    orderId,
  }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const userRating = ratings.find((r) => r.user === userId);

    const handleSubmitReview = async () => {
      try {
        console.log(productId);
        console.log(user[0]?._id);
        startLoading();
        const response = await FetchData(
          `products/rating/${productId}/${user[0]?._id}`,
          "post",
          { rating, comment }
        );
        console.log(response);
        fetchOrder();
        alertSuccess(response.data.message);
      } catch (err) {
        console.error(err);
        alertError(parseErrorMessage(err.response?.data));
      } finally {
        stopLoading();
      }
    };

    // ⭐ Read only stars (for already rated)
    const ReadOnlyStars = ({ rating }) => (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );

    // ⭐ Interactive stars (for new rating)
    const InteractiveStars = ({ rating, onRate }) => (
      <div className="flex items-center gap-1 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onRate(star)} // ✅ allow clicking
            className={`text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );

    return (
      <div className="flex lg:flex-row flex-col justify-center lg:items-center items-start bg-white shadow-md rounded-lg p-4 lg:mb-5 mb-2 lg:mx-5 w-screen lg:w-full lg:gap-20">
        <div className="flex flex-col-reverse justify-between items-center">
          <div className="py-2 flex flex-col justify-center items-start lg:gap-5 ">
            <h1 className="lg:text-base text-sm">{productName}</h1>
            <h2 className="">Seller: {sellerName}</h2>
            <h3 className="font-medium text-xl">
              <span>₹ {orderAmount}</span>{" "}
            </h3>
          </div>
          <div className="lg:w-48 lg:h-48 w-24 h-24 shadow overflow-hidden flex justify-center items-center rounded-lg object-center">
            <img src={images} className="" />
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <div className="flex justify-between items-center w-full">
            <div className="">
              <Button label={"Raise issue"} />
            </div>
            <div className="">
              <Button
                label={
                  <h1 className="flex justify-center items-center text-base">
                    <ArrowDownToLine className="h-4 w-4" /> Invoice
                  </h1>
                }
              />
            </div>
            <div className="">
              <Button
                label={"Reorder"}
                onClick={() => {
                  Navigate(`/current-product/${productId}`);
                }}
              />
            </div>
          </div>
          <div className="w-full mt-3">
            {userRating ? (
              <div className="p-3 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-2 text-green-700">
                  ✅ You already rated this product
                </h3>
                <ReadOnlyStars rating={userRating.rating} />
                {userRating.comment && (
                  <p className="mt-2 text-gray-700 italic">
                    "{userRating.comment}"
                  </p>
                )}
              </div>
            ) : (
              <>
                <h3 className="font-semibold mb-2">Rate this product</h3>
                <InteractiveStars rating={rating} onRate={setRating} />
                <textarea
                  className="w-full border rounded-lg p-2 mt-2"
                  placeholder="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  label="Submit Review"
                  className="mt-3"
                  onClick={handleSubmitReview}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className=" lg:px-10 py-10 flex lg:flex-row flex-col-reverse justify-center items-start lg:text-base text-sm ">
        <div className="flex flex-col w-screen lg:w-fit">
          <div className="bg-neutral-300 rounded-xl shadow-xl py-5 lg:px-10 px-5 flex justify-start items-start flex-col mb-4">
            <h1 className="text-lg font-semibold">Order Details</h1>
            <h1 className="font-semibold">
              Id: <span className="font-normal">{order?._id}</span>
            </h1>
            <h1 className="font-semibold">
              Payment Status:{" "}
              <span className="font-normal capitalize">
                {order?.paymentStatus}
              </span>
            </h1>
            <h1 className="font-semibold">
              Payment method:{" "}
              <span className="font-normal capitalize">
                {order?.paymentMethod}
              </span>
            </h1>
            <h1 className="font-semibold">
              Order status:{" "}
              {/* <span className="font-normal">{order?.orderStatus} </span> */}
              <span className="font-normal capitalize">
                {["pending", "confirmed", "readyForShipment"].includes(
                  order?.orderStatus
                )
                  ? "Confirmed"
                  : order?.orderStatus === "cancelledByUser"
                  ? "Cancelled"
                  : order?.orderStatus}
              </span>
            </h1>
            <h1 className="font-semibold">
              Order date <span className="text-xs font-light">(MMDDYY)</span>:{" "}
              <span className="font-normal">
                {new Date(order?.bookingDate).toLocaleDateString()}
              </span>
            </h1>
            <h1 className="font-semibold">
              Amount: <span className="font-normal">₹{order?.totalAmount}</span>
            </h1>
          </div>
          <div className="grid grid-cols-4 grid-rows-0 lg:gap-4 gap-1">
            {/* user: shipping details */}
            <div className=" shadow rounded-xl py-5 lg:px-10 px-5 flex justify-start items-start flex-col col-span-4 font-semibold bg-neutral-300 lg:text-base text-sm">
              Shipping Details
              <h1 className="flex flex-col">
                <span>
                  Street :{" "}
                  <span className="font-normal">
                    {shippingAddress?.street || "N/A"}
                  </span>
                </span>
                <span>
                  City:{" "}
                  <span className="font-normal">
                    {shippingAddress?.city || "N/A"}
                  </span>
                </span>
                <span>
                  State:{" "}
                  <span className="font-normal">
                    {shippingAddress?.state || "N/A"}
                  </span>
                </span>
                <span>
                  Postal Code:{" "}
                  <span className="font-normal">
                    {shippingAddress?.postalCode || "N/A"}
                  </span>
                </span>
              </h1>
            </div>
            {/* user: name  */}
            <div className=" shadow rounded-xl lg:text-base text-sm py-5 lg:px-10 px-5 flex flex-col justify-start items-start col-span-4  col-start-1 row-start-2 font-semibold bg-neutral-300">
              <span>
                Name: <span className="font-normal ml-2">{user[0]?.name}</span>
              </span>
              <span>
                Phone number:{" "}
                <span className="font-normal ml-2">{user[0]?.phoneNumber}</span>
              </span>
            </div>
            {/* user: contact number */}
            <div className="shadow rounded-xl lg:text-base text-sm py-5 lg:px-10 px-5 flex justify-start items-center col-span-4 row-start-4 font-semibold bg-neutral-300">
              {order?.orderStatus === "cancelledByUser" ? (
                <h1>You have cancelled this order</h1>
              ) : (
                <Button
                  label="Cancel Order"
                  onClick={() =>
                    setHandlePopup((prev) => {
                      return { ...prev, cancelOrderPopup: true };
                    })
                  }
                />
              )}
            </div>

            {/* product: name */}
          </div>
        </div>
        <div className="">
          {orderProducts?.map((product, index) => (
            <ProductsCard
              key={index}
              productId={product?.product?._id}
              productName={product?.product?.name}
              sellerName={product?.seller?.name}
              orderAmount={product?.price?.MRP}
              paymentMethod={order?.paymentMethod}
              orderId={order?._id}
              images={product?.product?.images[0]?.url}
              ratings={product?.product?.ratings} // ✅ pass ratings here
              userId={user[0]?._id} // ✅ pass current user id
            />
          ))}
        </div>
      </div>
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
            {/* <InputBox LabelName={"Reason to cancel order"} /> */}
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
    </div>
  );
};

export default LoadingUI(CurrentOrder);
