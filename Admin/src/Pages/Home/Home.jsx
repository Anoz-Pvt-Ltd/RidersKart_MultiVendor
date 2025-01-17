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
import InputBox from "../../Components/InputBox";
import { all } from "axios";

const Dashboard = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const [activeSection, setActiveSection] = useState("Users");
  const [error, setError] = useState("");
  const [allUser, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allVerifiedVendors, setAllVerifiedVendors] = useState([]);
  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };
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
  const tableHeadersVendors = [
    "Vendor ID",
    "Name",
    "Email",
    "Contact No.",
    "Total Products",
  ];

  const [searchTermUser, setSearchTermUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUser);

  const [searchTermProduct, setSearchTermProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const [searchTermOrders, setSearchTermOrders] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(allOrders);

  const [searchTermVerifiedVendors, setSearchTermVerifiedVendors] =
    useState("");
  const [filteredVerifiedVendors, setFilteredVerifiedVendors] =
    useState(allVerifiedVendors);

  //filtering functions for each entities
  const handleSearchUser = (e) => {
    const searchValueUser = e.target.value;
    setSearchTermUser(searchValueUser);

    if (searchValueUser === "") {
      setFilteredUsers(allUser);
    } else {
      const filtered = allUser.filter(
        (user) =>
          user._id.includes(searchValueUser) ||
          user.phoneNumber.includes(searchValueUser)
      );
      setFilteredUsers(filtered);
    }
  };
  const handleSearchProduct = (e) => {
    const searchValueProduct = e.target.value;
    setSearchTermProduct(searchValueProduct);

    if (searchValueProduct === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (product) =>
          product._id.includes(searchValueProduct) ||
          product.vendor.includes(searchValueProduct)
      );
      setFilteredProducts(filtered);
    }
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
  const handleSearchVerifiedVendors = (e) => {
    const searchValueVerifiedVendors = e.target.value;
    setSearchTermVerifiedVendors(searchValueVerifiedVendors);

    if (searchValueVerifiedVendors === "") {
      setFilteredVerifiedVendors(allVerifiedVendors);
    } else {
      const filtered = allVerifiedVendors.filter(
        (vendor) =>
          vendor._id.includes(searchValueVerifiedVendors) ||
          vendor.contactNumber.includes(searchValueVerifiedVendors)
      );
      setFilteredVerifiedVendors(filtered);
    }
  };

  useEffect(() => {
    setFilteredUsers(allUser);
    setFilteredProducts(allProducts);
    setFilteredOrders(allOrders);
    setFilteredVerifiedVendors(allVerifiedVendors);
  }, [allUser, allProducts, allOrders, allVerifiedVendors]);

  //fetching all data for all users,products,orders,vendors(verified) and vendors(not-verified)
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

    const fetchAllVerifiedVendors = async () => {
      if (user?.length > 0) {
        try {
          const response = await FetchData(
            "vendor/admin/get-all-verified-vendor",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllVerifiedVendors(response.data.data.vendors);
          } else {
            setError("Failed to load vendors.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch vendors.");
        }
      }
    };

    fetchAllUsers();
    fetchAllProducts();
    fetchAllOrders();
    fetchAllVerifiedVendors();
  }, [user]);

  console.log(allVerifiedVendors);

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
              {/* sorting box */}
              <div className="mb-4">
                <InputBox
                  Type="test"
                  Value={searchTermUser}
                  onChange={handleSearchUser}
                  Placeholder={"Search by ID or Contact Number"}
                />
              </div>
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
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="border border-gray-500 px-4 py-2">
                            <Link to={`/current-user/${user._id}`}>
                              {user?._id}
                            </Link>
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {user?.name}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {user?.email}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {user?.phoneNumber}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableHeadersUsers.length}
                          className="text-center py-4"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
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
              <InputBox
                Type="test"
                Value={searchTermVerifiedVendors}
                onChange={handleSearchVerifiedVendors}
                Placeholder={"Search by Product ID or Vendor ID"}
              />
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
                  <thead>
                    <tr>
                      {tableHeadersVendors.map((header, index) => (
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
                    {filteredVerifiedVendors.length > 0 ? (
                      filteredVerifiedVendors.map((vendor) => (
                        <tr key={vendor.id}>
                          <td className="border border-gray-500 px-4 py-2">
                            <Link to={`/current-vendor/${vendor?._id}`}>
                              {vendor?._id}
                            </Link>
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {vendor?.name}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {vendor?.email}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {vendor?.contactNumber}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {vendor?.products?.length}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableHeadersProducts.length}
                          className="text-center py-4"
                        >
                          No Vendors found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeSection === "Products" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Products</h2>
              <InputBox
                Type="test"
                Value={searchTermProduct}
                onChange={handleSearchProduct}
                Placeholder={"Search by Product ID or Vendor ID"}
              />
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
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableHeadersProducts.length}
                          className="text-center py-4"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeSection === "Orders" && (
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
                            <Link to={`/current-order/${order._id}`}>
                              {order._id}
                            </Link>
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
