import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { FetchData } from "../../utils/FetchFromApi";
import { useSelector } from "react-redux";
import LoadingUI from "../../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { Check, RefreshCcw } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Orders = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [sortedOrders, setSortedOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Confirmed");

  const [allPendingOrders, setAllPendingOrders] = useState([]);
  const [allConfirmOrders, setAllConfirmOrders] = useState([]);
  const [allShippedOrders, setAllShippedOrders] = useState([]);
  const [allDeliveredOrders, setAllDeliveredOrders] = useState([]);
  const [allCancelOrders, setAllCancelOrders] = useState([]);

  const sections = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    // "Booked",
  ];
  const tableHeaders = [
    "Order Id",
    "Product Name",
    "Category Id / Subcategory Id",
    "Quantity",
    "MRP",
    "Selling Price",
    "Order Status",
    "Payment Status",
    "Placed at",
  ];

  useEffect(() => {
    setSortedOrders(allOrders);
  }, [allOrders]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSort = () => {
    if (!selectedDate) {
      setSortedOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.updatedAt).toISOString().split("T")[0];
      return orderDate === selectedDate;
    });
    setSortedOrders(filtered);
  };

  const fetchAllOrders = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(
          `orders/get-vendor-orders/${user?.[0]?._id}`,
          "get"
        );
        // setAllOrders(response.data.orders);
        let orders = response.data.orders;
        const pending = orders.filter(
          (o) => !o.orderStatus || o.orderStatus === "pending"
        );
        const confirm = orders.filter(
          (o) => !o.orderStatus || o.orderStatus === "confirmed"
        );
        const shipped = orders.filter(
          (o) => !o.orderStatus || o.orderStatus === "shipped"
        );
        const delivered = orders.filter(
          (o) => !o.orderStatus || o.orderStatus === "delivered"
        );
        const cancel = orders.filter(
          (o) => !o.orderStatus || o.orderStatus === "cancelled"
        );
        setAllPendingOrders(pending);
        setAllConfirmOrders(confirm);
        setAllShippedOrders(shipped);
        setAllDeliveredOrders(delivered);
        setAllCancelOrders(cancel);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        stopLoading();
      }
    }
  };
  useEffect(() => {
    fetchAllOrders();
  }, [user]);

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  const TableUi = ({ orders, headers }) => {
    return (
      <div className="">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 ">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th className="py-2 px-4 border-b text-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100 text-xs">
                    <td className="py-2 px-4 border-b text-blue-500">
                      <Link
                        // onClick={() => navigate(`/current/order/${order.id}`)}
                        to={`/current/order/${order._id}`}
                        className="hover:underline"
                      >
                        {order._id}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.product.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b truncate">
                      Category ID:{" "}
                      <span className="text-xs">
                        {order.products[0]?.product.category || "N/A"}
                      </span>{" "}
                      <br />
                      Subcategory ID:
                      <span className="text-xs">
                        {order.products[0]?.product.subcategory || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.quantity}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.MRP}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.sellingPrice}
                    </td>
                    <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                    <td className="py-2 px-4 border-b">
                      {order.paymentStatus}
                    </td>

                    <td className="py-2 px-4 border-b">
                      {new Date(order.updatedAt).toLocaleDateString()}
                      {/* {order.updatedAt} */}
                    </td>
                    {/* <td className="py-2 px-4 border-b">
                      <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                        View
                      </button>
                    </td> */}
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
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg  h-screen overflow-scroll">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 flex justify-start items-center">
        Orders{" "}
        <span>
          <button onClick={() => fetchAllOrders()}>
            <RefreshCcw className="text-red-600" />
          </button>
        </span>
      </h2>
      <div className="flex items-start justify-center mb-4 gap-2 flex-col">
        <div className="flex lg:items-center lg:flex-row flex-col mb-4 gap-2">
          <label htmlFor="date" className="font-medium">
            Sort by Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={handleSort}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Sort
          </button>
          {selectedDate && (
            <button
              onClick={() => {
                setSelectedDate("");
                setSortedOrders(allOrders);
              }}
              className="ml-2 text-sm text-gray-600 underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="border-b border-gray-200 rounded-lg shadow-md w-full text-xs lg:hidden block">
          {/* Question Row */}
          <button
            onClick={() => setOpenIndex(true)}
            className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
          >
            <span className="font-medium text-gray-700 space-x-2">
              <strong>Order Status</strong>{" "}
              <span className="underline text-blue-500">{activeSection}</span>
            </span>
            <FaChevronDown
              className={`text-gray-500 transform transition-transform duration-300 ${
                openIndex ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Answer Section with Animation */}
          <AnimatePresence>
            {openIndex && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col lg:flex-row lg:bg-neutral-200 w-full justify-center items-center py-2 rounded-xl gap-2">
                  {sections.map((section, idx) => (
                    <li
                      key={section}
                      className={`cursor-pointer transition-all duration-300 color-purple rounded-xl shadow-2xl lg:w-fit w-full px-4 py-2 list-none hover:text-[#DF3F33] ${
                        activeSection === section
                          ? " list-none bg-[#DF3F33] text-white hover:text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        setActiveSection(section);
                        setOpenIndex(false);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {activeSection === section && (
                          <span className="text-white">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                        {section}
                      </span>
                    </li>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden lg:flex flex-col lg:flex-row lg:bg-neutral-200 w-3/4 justify-evenly items-center py-2 rounded-xl gap-2">
          {sections.map((section, idx) => (
            <li
              key={section}
              className={`cursor-pointer transition-all duration-300 color-purple rounded-xl shadow-2xl lg:w-fit w-full px-4 py-2 list-none hover:text-[#DF3F33] ${
                activeSection === section
                  ? " list-none bg-[#DF3F33] text-white hover:text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setActiveSection(section);
              }}
            >
              <span className="flex items-center gap-2">
                {activeSection === section && (
                  <span className="text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {section}
              </span>
            </li>
          ))}
        </div>
      </div>
      {/* Detailed Order List */}
      {activeSection === "Pending" && (
        <TableUi orders={allPendingOrders} headers={tableHeaders} />
      )}
      {activeSection === "Confirmed" && (
        <TableUi orders={allConfirmOrders} headers={tableHeaders} />
      )}
      {activeSection === "Shipped" && (
        <TableUi orders={allShippedOrders} headers={tableHeaders} />
      )}
      {activeSection === "Delivered" && (
        <TableUi orders={allDeliveredOrders} headers={tableHeaders} />
      )}
      {activeSection === "Cancelled" && (
        <TableUi orders={allCancelOrders} headers={tableHeaders} />
      )}
    </div>
  );
};

export default LoadingUI(Orders);
