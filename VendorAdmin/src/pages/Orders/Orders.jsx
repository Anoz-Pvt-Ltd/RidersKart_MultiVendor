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
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            `orders/all-products-of-vendor/${user?.[0]?._id}`,
            "get"
          );
          if (response.data.success) {
            setAllOrders(response.data.orders);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };
    fetchAllOrders();
  }, [user]);
  console.log(allOrders);

  

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Orders</h2>
      {/* Detailed Order List */}
      <div className="container mx-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Shipping Address</th>
                <th className="py-2 px-4 border-b">Placed At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.length > 0 ? (
                allOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{order._id}</td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.product.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.product.category.main || "N/A"} -{" "}
                      {order.products[0]?.product.category.sub || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.quantity}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.price}
                    </td>
                    <td className="py-2 px-4 border-b">{order.totalAmount}</td>
                    <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                    <td className="py-2 px-4 border-b">
                      {order.paymentStatus}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}, ${order.shippingAddress.postalCode}`}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(order.placedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-2 px-4 text-center">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
