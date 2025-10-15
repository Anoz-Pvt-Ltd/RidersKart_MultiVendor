import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { Check } from "lucide-react";
import LoadingUI from "../../Components/Loading";

const Orders = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allOrders, setAllOrders] = useState([]);
  const tableHeaders = [
    "Order ID",
    "User ID",
    "Quantity",
    "Price",
    "Order Status",
    "Payment Status",
    "Placed On",
  ];
  const sections = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Return",
  ];
  const [activeSection, setActiveSection] = useState("Confirmed");
  const [allPendingOrders, setAllPendingOrders] = useState([]);
  const [allConfirmOrders, setAllConfirmOrders] = useState([]);
  const [allShippedOrders, setAllShippedOrders] = useState([]);
  const [allDeliveredOrders, setAllDeliveredOrders] = useState([]);
  const [allCancelOrders, setAllCancelOrders] = useState([]);
  console.log(allConfirmOrders);
  const [searchTermOrders, setSearchTermOrders] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.bookingDate);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
    setFilteredOrders(filtered);
  };

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

  const handleSortByDate = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sorted = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.bookingDate);
      const dateB = new Date(b.bookingDate);
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredOrders(sorted);
  };

  useEffect(() => {
    // Whenever allOrders changes, reset sorting
    setFilteredOrders(allOrders);
    setSortOrder("desc");
  }, [allOrders]);

  const fetchAllOrders = async () => {
    if (user?.length > 0) {
      try {
        startLoading();
        const response = await FetchData(`orders/admin/all-orders`, "get");
        // setAllOrders(response.data.orders);
        let orders = response.data.data.orders;
        console.log(response);
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
    // const fetchAllOrders = async () => {
    //   if (user?.length > 0) {
    //     try {
    //       startLoading();
    //       const response = await FetchData("orders/admin/all-orders", "get");
    //       console.log(response);
    //       if (response.data.success) {
    //         setAllOrders(response.data.data.orders);
    //       } else {
    //         setError("Failed to Products.");
    //       }
    //     } catch (err) {
    //       setError(err.response?.data?.message || "Failed to Products");
    //     } finally {
    //       stopLoading();
    //     }
    //   }
    // };

    // fetchAllProducts();
    fetchAllOrders();
  }, [user]);

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
                        to={`/current-order/${order._id}`}
                        className="hover:underline"
                      >
                        {order._id}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.user || "N/A"}
                    </td>
                    {/* <td className="py-2 px-4 border-b truncate">
                      Category ID:{" "}
                      <span className="text-xs">
                        {order.products[0]?.product.category || "N/A"}
                      </span>{" "}
                      <br />
                      Subcategory ID:
                      <span className="text-xs">
                        {order.products[0]?.product.subcategory || "N/A"}
                      </span>
                    </td> */}
                    <td className="py-2 px-4 border-b">
                      {order.products[0]?.quantity}
                    </td>
                    <td className="py-2 px-4 border-b">{order.totalAmount}</td>
                    {/* <td className="py-2 px-4 border-b">
                      {order.products[0]?.price?.sellingPrice}
                    </td> */}
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
    <section className="h-screen overflow-scroll w-full">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermOrders}
          onChange={handleSearchOrder}
          Placeholder={"Search by Product ID or Vendor ID"}
        />
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          <div className="flex gap-2 items-center">
            <label className="font-medium">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-medium">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredOrders(allOrders);
            }}
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
          >
            Reset
          </button>
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
        {activeSection === "Return" && (
          <TableUi orders={allCancelOrders} headers={tableHeaders} />
        )}
      </div>
    </section>
  );
};

export default LoadingUI(Orders);
