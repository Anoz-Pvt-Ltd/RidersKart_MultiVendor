import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FetchData } from "../../Utility/FetchFromApi";
import { useSelector } from "react-redux";
import Button from "../../Components/Button";

const CurrentOrder = () => {
  const { orderId } = useParams();
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState("");
  const [currentOrder, setCurrentOrder] = useState([]);
  const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
  const [CurrentOrderAddress, setCurrentOrderAddress] = useState();

  useEffect(() => {
    const fetchOrder = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `orders/admin/current-order/${orderId}`,
            "get"
          );
          //   console.log(response);
          if (response.data.success) {
            setCurrentOrder(response.data.data.orders);
            setCurrentOrderProducts(response.data.data.orders.products);
            setCurrentOrderAddress(response.data.data.orders.shippingAddress);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };

    fetchOrder();
  }, [user]);

  // console.log(currentOrder);
  //   console.log(currentOrderProducts);
  //   console.log(CurrentOrderAddress);

  const Entities = [
    { label: "User Id" },
    { label: "Product Id" },
    { label: "Shipping Address" },
    { label: "Booking Date" },
    { label: "Order Status" },
    { label: "Payment Status" },
    { label: "Amount" },
    { label: "Vendor Id" },
  ];

  const fullAddress = `${CurrentOrderAddress?.street}, ${CurrentOrderAddress?.city}, ${CurrentOrderAddress?.state} ${CurrentOrderAddress?.postalCode}, ${CurrentOrderAddress?.country}`;

  return (
    <div>
      <div className="p-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Details
        </h2>
        <h1>
          Order Id:{" "}
          <span className="text-2xl font-semibold">{currentOrder?._id}</span>
        </h1>
        <div className="flex justify-center items-center gap-20 mt-10">
          <Button label={"Return Order"} />
          <Button label={"Replace Order"} />
          <Button label={"Make Order Pending"} />
          <Button label={"Cancel Order"} />
        </div>
        <table className="min-w-full table-auto mt-10">
          <thead>
            <tr className="bg-gray-100">
              {Entities.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-600"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentOrder?.user}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentOrderProducts?.[0]?._id}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{fullAddress}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentOrder?.bookingDate}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentOrder?.orderStatus}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentOrder?.paymentStatus}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                ₹ {currentOrderProducts?.[0]?.price}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {currentOrder?.vendor}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentOrder;
