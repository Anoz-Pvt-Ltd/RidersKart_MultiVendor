import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";

const Orders = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allOrders, setAllOrders] = useState([]);
  const tableHeadersOrder = [
    "Order ID",
    "User ID",
    "Price",
    "Status",
    "Placed On",
  ];

  const [searchTermOrders, setSearchTermOrders] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);

  const handleSearchOrder = (e) => {
    const searchValueOrder = e.target.value;
    setSearchTermOrders(searchValueOrder);

    if (searchValueOrder === "") {
      setFilteredOrders(allOrders);
    } else {
      const filtered = allOrders.filter(
        (order) =>
          order._id.includes(searchValueOrder) ||
          order.user.includes(searchValueOrder)
      );
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    setFilteredOrders(allOrders);
  }, [allOrders]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData("orders/admin/all-orders", "get");
          // console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.data.orders);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to Products");
        } finally {
          stopLoading();
        }
      }
    };

    // fetchAllProducts();
    fetchAllOrders();
  }, [user]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermOrders}
          onChange={handleSearchOrder}
          Placeholder={"Search by Product ID or Vendor ID"}
        />
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersOrder.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-500 px-4 py-2 bg-neutral-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link to={`/current-order/${order._id}`}>{order._id}</Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order?.user}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.totalAmount}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.orderStatus}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {order.bookingDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersOrder.length}
                  className="text-center py-4"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(Orders);
