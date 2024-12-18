import React from "react";
import OrderCard from "./OrderCard";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUndoAlt,
  FaClipboardList,
} from "react-icons/fa";
import {
  orderData,
  detailedOrderData,
} from "../../constants/VendorDashboard.Order";

const Orders = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Orders</h2>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {orderData.map((order, index) => (
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
              {detailedOrderData.map((order, index) => (
                <tr
                  key={index}
                  className="text-sm text-gray-700 border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">{order.product}</td>
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
                  <td className="py-3 px-4">{order.date}</td>
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
