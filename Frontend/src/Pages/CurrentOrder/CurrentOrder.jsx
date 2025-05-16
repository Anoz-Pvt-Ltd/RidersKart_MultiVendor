import React, { useEffect, useState } from "react";
import LoadingUI from "../../Components/Loading";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import Button from "../../Components/Button";

const CurrentOrder = ({ startLoading, stopLoading }) => {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const [orderProducts, setOrderProducts] = useState([]);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState([]);
  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);
  const tableHeaders = [
    "Product Name",
    "Shipping Details",
    "Phone Number",
    "Price Details",
    "Order Date",
    "Delivery Date",
    "Rating",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            `orders/admin/current-order/${orderId}`,
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setOrder(response.data.data.orders);
            setOrderProducts(response.data.data.orders.products);
            setShippingAddress(response.data.data.orders.shippingAddress);
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

    fetchOrder();
  }, [user]);

  return (
    <div>
      CurrentOrder ID :{orderId}
      <div className=" px-10 py-20">
        <div className="grid grid-cols-5 grid-rows-0 gap-4">
          {/* user: shipping details */}
          <div className=" shadow rounded-xl py-2 px-1 flex justify-start items-start flex-col col-span-2 font-semibold">
            Shipping Details
            <h1 className="flex flex-col">
              <span>
                Street :{" "}
                <span className="font-light">{shippingAddress.street}</span>
              </span>
              <span>
                City: <span className="font-light">{shippingAddress.city}</span>
              </span>
              <span>
                State:{" "}
                <span className="font-light">{shippingAddress.state}</span>
              </span>
              <span>
                Postal Code:{" "}
                <span className="font-light">{shippingAddress.postalCode}</span>
              </span>
            </h1>
          </div>
          {/* user: name  */}
          <div className=" shadow rounded-xl text-xl py-2 px-1 flex justify-start items-center col-span-2 row-span-2 col-start-1 row-start-2 font-semibold">
            Name: <span className="font-light ml-2">{user[0]?.name}</span>
          </div>
          {/* user: contact number */}
          <div className="shadow rounded-xl  py-2 px-1 flex justify-start items-center col-span-2 col-start-1 row-start-4 font-semibold">
            Phone number:{" "}
            <span className="font-light ml-2">{user[0]?.phoneNumber}</span>
          </div>

          {/* product: name */}
          <div className="ml-10 border border-neutral-400 py-2 px-1 flex justify-start items-center col-span-2 row-span-2 col-start-3 row-start-1">
            Product name
          </div>
          <div className="border border-neutral-400 py-2 px-1 flex justify-start items-center row-span-2 col-start-5 row-start-1">
            prodduct image
          </div>
          <div className="ml-10 border border-neutral-400 py-2 px-1 flex justify-start items-center col-start-3 row-start-3">
            seller name
          </div>
          <div className=" py-2 px-1 flex justify-center items-center col-start-5 row-start-3">
            <Button label={"Raise an issue for this order"} />
          </div>
          <div className="font-medium  py-2 px-1 flex justify-center items-center col-start-4 row-start-3 shadow rounded-xl gap-10">
            <span>₹ {order?.totalAmount}</span>{" "}
            <span className="font-light">{order?.paymentMethod}</span>
          </div>
          <div className="ml-10 border border-neutral-400 py-2 px-1 flex justify-start items-center col-span-3 col-start-3 row-start-4">
            rating
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingUI(CurrentOrder);
