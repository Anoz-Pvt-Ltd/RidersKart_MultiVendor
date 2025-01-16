import React, { useEffect, useState } from "react";
import {
  Heart,
  ListOrdered,
  Newspaper,
  Package,
  ScanLine,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const [activeSection, setActiveSection] = useState("Users");
  const [error, setError] = useState("");
  const [allUser, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const tableHeadersUsers = ["ID", "Name", "Email", "Contact No."];
  const tableHeadersProducts = [
    "Product ID",
    "Vendor ID",
    "Category",
    "Subcategory",
  ];
  const tableHeadersOrder = [
    "Order ID",
    "User ID",
    "Price",
    "Status",
    "Placed On",
  ];
  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData("users/admin/get-all-users", "get");
          // console.log(response);
          if (response.data.success) {
            setAllUsers(response.data.data.users);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };

    const fetchAllProducts = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            "products/admin/get-all-products",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllProducts(response.data.data);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to Products");
        }
      }
    };

    const fetchAllOrders = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData("orders/admin/all-orders", "get");
          console.log(response);
          if (response.data.success) {
            setAllOrders(response.data.data.orders);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to Products");
        }
      }
    };

    fetchAllUsers();
    fetchAllProducts();
    fetchAllOrders();
  }, [user]);

  // console.log(allOrders);

  return (
    <div className="flex min-h-screen">
      <motion.aside
        className="w-64 text-black p-4 shadow-lg"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <nav>
          <ul>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Users"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Users")}
            >
              {<User />}Users
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Vendors (Under review)"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Vendors (Under review)")}
            >
              {<ListOrdered />}Vendors (Under review)
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Vendors (Verified)"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Vendors (Verified)")}
            >
              {<Newspaper />}Vendors (Verified)
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Products"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Products")}
            >
              {<Package />}Products
            </li>
            <li
              className={`p-4 rounded-md mb-2 cursor-pointer transition-all duration-300 ${
                activeSection === "Orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Orders")}
            >
              {<ScanLine />}Orders
            </li>
            <li
              className={`p-4 rounded-md cursor-pointer transition-all duration-300 ${
                activeSection === "Promotions"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Promotions")}
            >
              {<Heart />}Promotions
            </li>
          </ul>
        </nav>
      </motion.aside>
      <main className="flex-1 p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
        >
          {activeSection === "Users" && (
            <section>
              {/* main component */}
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
                  <thead>
                    <tr>
                      {tableHeadersUsers.map((header, index) => (
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
                    {allUser.map((user) => (
                      <tr key={user.id}>
                        <td className="border border-gray-500 px-4 py-2">
                          <Link to={`/current-user/${user._id}`}>
                            {user._id}
                          </Link>
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {user.name}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {user.email}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {user.phoneNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeSection === "Vendors (Under review)" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Vendors (Under review)
              </h2>
              {/*content*/}
            </section>
          )}
          {activeSection === "Vendors (Verified)" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Vendors (Verified)</h2>
              {/* Vendors (Verified) content */}
            </section>
          )}
          {activeSection === "Products" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Products</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
                  <thead>
                    <tr>
                      {tableHeadersProducts.map((header, index) => (
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
                    {allProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="border border-gray-500 px-4 py-2">
                          <Link to={`/current-product/${product._id}`}>
                            {product._id}
                          </Link>
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {product.vendor}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {product.category.main}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {product.category.sub}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeSection === "Orders" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Orders</h2>
              <div className="overflow-x-auto">
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
                    {allOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="border border-gray-500 px-4 py-2">
                          <Link to={`/current-order/${order._id}`}>
                            {order._id}
                          </Link>
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {order.user}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeSection === "Promotions" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Promotions</h2>
              {/* Promotions content */}
            </section>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
