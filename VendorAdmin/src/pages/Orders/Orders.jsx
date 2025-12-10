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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeSectionOrder, setActiveSectionOrder] = useState("Pending");

  const [allPendingOrders, setAllPendingOrders] = useState([]);
  const [allConfirmOrders, setAllConfirmOrders] = useState([]);
  const [allReadyShipOrders, setAllReadyShipOrders] = useState([]);
  const [allShippedOrders, setAllShippedOrders] = useState([]);
  const [allDeliveredOrders, setAllDeliveredOrders] = useState([]);
  const [allCancelOrders, setAllCancelOrders] = useState([]);

  const sections = [
    "Pending",
    "Confirmed",
    "Ready For Shipment",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Return",
  ];
  const tableHeaders = [
    "Order Id",
    "Product Name",
    "Category Id / Subcategory Id",
    "Quantity",
    // "MRP",
    "Selling Price",
    // "Order Status",
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
    if (!startDate || !endDate) {
      // If either date missing → show all but sorted latest first
      const sorted = [...allOrders].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setSortedOrders(sorted);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Include whole day properly
    end.setHours(23, 59, 59, 999);

    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.updatedAt);
      return orderDate >= start && orderDate <= end;
    });

    const sortedFiltered = filtered.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    setSortedOrders(sortedFiltered);
  };

  const fetchAllOrders = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(
          `orders/get-vendor-orders/${user?.[0]?._id}`,
          "get"
        );
        let orders = response.data.orders || [];

        // keep a master list (used by sorting) and initial sorted state
        setAllOrders(orders);
        setSortedOrders(orders);

        // proper per-status filters (don't reuse !o.orderStatus for every status)
        const pending = orders.filter(
          (o) => !o.orderStatus || o.orderStatus === "pending"
        );
        const confirm = orders.filter((o) => o.orderStatus === "confirmed");
        const readyForShip = orders.filter(
          (o) => o.orderStatus === "readyForShipment"
        );
        const shipped = orders.filter((o) => o.orderStatus === "shipped");
        const delivered = orders.filter((o) => o.orderStatus === "delivered");
        const cancel = orders.filter((o) => o.orderStatus === "cancelled");

        setAllPendingOrders(pending);
        setAllConfirmOrders(confirm);
        setAllReadyShipOrders(readyForShip);
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
                    {/* <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.MRP}
                    </td> */}
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.sellingPrice}
                    </td>
                    {/* <td className="py-2 px-4 border-b">{order.orderStatus}</td> */}
                    <td className="py-2 px-4 border-b">
                      {/* {order.paymentStatus} */}
                      <h1>
                        {order.paymentStatus === "pending" ? (
                          <h1 className="bg-yellow-100 w-fit px-2 py-1 rounded-xl text-yellow-600">
                            Pending
                          </h1>
                        ) : (
                          <h1 className="bg-green-100 w-fit px-2 py-1 rounded-xl text-green-600">
                            Complete
                          </h1>
                        )}
                      </h1>
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

  const ordersForSection = (section) => {
    if (section === "Pending") {
      return sortedOrders.filter(
        (o) => !o.orderStatus || o.orderStatus === "pending"
      );
    }
    if (section === "Return") {
      return sortedOrders.filter((o) => o.orderStatus === "return");
    }
    if (section === "Ready For Shipment") {
      return sortedOrders.filter((o) => o.orderStatus === "readyForShipment");
    }
    // other sections use lowercase
    return sortedOrders.filter((o) => o.orderStatus === section.toLowerCase());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg  h-screen overflow-scroll">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 flex justify-start items-center ">
        Orders{" "}
        <span>
          <button onClick={() => fetchAllOrders()}>
            <RefreshCcw className="text-red-600" />
          </button>
        </span>
      </h2>
      <div className="flex items-start justify-center mb-4 gap-2 flex-col sticky top-0 left-0 bg-white">
        <div className="flex lg:items-center lg:flex-row flex-col mb-4 gap-2">
          <label className="font-medium">Date Range:</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <h1>from</h1>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <button
            onClick={handleSort}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Filter
          </button>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                // Reset to all orders sorted latest first
                const sorted = [...allOrders].sort(
                  (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                );
                setSortedOrders(sorted);
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
              <span className="underline text-blue-500">
                {activeSectionOrder}
              </span>
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
                        activeSectionOrder === section
                          ? " list-none bg-[#DF3F33] text-white hover:text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        setActiveSectionOrder(section);
                        setOpenIndex(false);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {activeSectionOrder === section && (
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
                activeSectionOrder === section
                  ? " list-none bg-[#DF3F33] text-white hover:text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setActiveSectionOrder(section);
              }}
            >
              <span className="flex items-center gap-2">
                {activeSectionOrder === section && (
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
      {activeSectionOrder === "Pending" && (
        <TableUi orders={ordersForSection("Pending")} headers={tableHeaders} />
      )}
      {activeSectionOrder === "Confirmed" && (
        <TableUi
          orders={ordersForSection("Confirmed")}
          headers={tableHeaders}
        />
      )}
      {activeSectionOrder === "Ready For Shipment" && (
        <TableUi
          orders={ordersForSection("Ready For Shipment")}
          headers={tableHeaders}
        />
      )}
      {activeSectionOrder === "Shipped" && (
        <TableUi orders={ordersForSection("Shipped")} headers={tableHeaders} />
      )}
      {activeSectionOrder === "Delivered" && (
        <TableUi
          orders={ordersForSection("Delivered")}
          headers={tableHeaders}
        />
      )}
      {activeSectionOrder === "Cancelled" && (
        <TableUi
          orders={ordersForSection("Cancelled")}
          headers={tableHeaders}
        />
      )}
      {activeSectionOrder === "Return" && (
        <TableUi orders={ordersForSection("Return")} headers={tableHeaders} />
      )}
    </div>
  );
};

export default LoadingUI(Orders);
