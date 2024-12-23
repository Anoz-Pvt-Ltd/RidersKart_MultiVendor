import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUndoAlt,
  FaClipboardList,
} from "react-icons/fa";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";

const Orders = () => {
  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);
  const [orderSummary, setOrderSummary] = useState([]);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders for the vendor
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // const vendorId = {user?.[0]?._id}; // Replace with the actual vendor ID
      const response = await FetchData(
        `orders/get-vendor-orders/${user?.[0]?._id}`,
        "get"
      );

      if (response?.status === 200) {
        const orders = response.data.data;

        // Process order summary
        const summary = [
          {
            title: "Total Orders",
            count: orders.length,
            color: "bg-blue-500",
            icon: <FaClipboardList />,
          },
          {
            title: "Delivered Orders",
            count: orders.filter((order) => order.status === "Delivered")
              .length,
            color: "bg-green-500",
            icon: <FaCheckCircle />,
          },
          {
            title: "Cancelled Orders",
            count: orders.filter((order) => order.status === "Cancelled")
              .length,
            color: "bg-red-500",
            icon: <FaTimesCircle />,
          },
          {
            title: "Pending Orders",
            count: orders.filter((order) => order.status === "Pending").length,
            color: "bg-yellow-500",
            icon: <FaUndoAlt />,
          },
          {
            title: "Shipped Orders",
            count: orders.filter((order) => order.status === "Shipped").length,
            color: "bg-indigo-500",
            icon: <FaTruck />,
          },
          {
            title: "Processing Orders",
            count: orders.filter((order) => order.status === "Processing")
              .length,
            color: "bg-purple-500",
            icon: <FaBox />,
          },
        ];

        setOrderSummary(summary);
        setDetailedOrders(orders);
      } else {
        setError("Failed to fetch orders. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-gray-700 text-center">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Orders</h2>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {orderSummary.map((order, index) => (
          <OrderCard
            key={index}
            title={order.title}
            count={order.count}
            color={order.color}
            icon={order.icon}
          />
        ))}
      </div>

      {/* Detailed Order List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-600 mb-4">
          Order Details
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left text-sm font-medium">
                <th className="py-3 px-4 border-b">Order ID</th>
                <th className="py-3 px-4 border-b">Customer Name</th>
                <th className="py-3 px-4 border-b">Product</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Payment</th>
                <th className="py-3 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {detailedOrders.map((order, index) => (
                <tr
                  key={index}
                  className="text-sm text-gray-700 border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.customer.name}</td>
                  <td className="py-3 px-4">{order.product.name}</td>
                  <td
                    className={`py-3 px-4 font-bold ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Cancelled"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td
                    className={`py-3 px-4 ${
                      order.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
