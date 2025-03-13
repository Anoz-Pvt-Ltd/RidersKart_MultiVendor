import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  ListOrdered,
  Newspaper,
  Package,
  PencilLine,
  ScanLine,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import { ClipboardCopy } from "lucide-react";
import LoadingUI from "../../Components/Loading";
import Users from "../Users/Users";
import VendorUnderReview from "../Vendor_UnderReview/VendorUnderReview";
import VendorsVerified from "../Vendors_Verified/VendorsVerified";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";

const Dashboard = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [activeSection, setActiveSection] = useState("Users");
  const [error, setError] = useState("");

  const [allBrands, setAllBrands] = useState([]);

  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const sidebarVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const tableHeadersBrands = [
    "Brand ID",
    "Brand name",
    "Added by",
    "Added On",
    "Status",
  ];

  const [searchTermBrands, setSearchTermBrands] = useState("");
  const [filteredBrands, setFilteredBrands] = useState(allBrands);

  //filtering functions for each entities

  const handleSearchBrands = (e) => {
    const searchValueBrands = e.target.value;
    setSearchTermBrands(searchValueBrands);

    if (searchValueBrands === "") {
      setFilteredBrands(allBrands);
    } else {
      const filtered = allBrands.filter(
        (order) =>
          order._id.includes(searchValueBrands) ||
          order.user.includes(searchValueBrands)
      );
      setFilteredBrands(filtered);
    }
  };

  useEffect(() => {
    setFilteredUsers(allUser);
    setFilteredProducts(allProducts);
    setFilteredOrders(allOrders);
    setFilteredUnVerifiedVendors(allUnverifiedVendors);
    setFilteredVerifiedVendors(allVerifiedVendors);
  }, [
    allUser,
    allProducts,
    allOrders,
    allUnverifiedVendors,
    allVerifiedVendors,
  ]);

  //fetching all data for all users,products,orders,vendors(verified) and vendors(not-verified)
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData("users/admin/get-all-users", "get");
          // console.log(response);
          if (response.data.success) {
            setAllUsers(response.data.data.users);
          } else {
            setError("Failed to load orders.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
          stopLoading();
        }
      }
    };

    const fetchAllProducts = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
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
        } finally {
          stopLoading();
        }
      }
    };

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

    const fetchAllUnVerifiedVendors = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "vendor/admin/get-all-unverified-vendor",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllUnverifiedVendors(response.data.data.vendor);
          } else {
            setError("Failed to load vendors.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch vendors.");
        } finally {
          stopLoading();
        }
      }
    };
    const fetchAllVerifiedVendors = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "vendor/admin/get-all-verified-vendor",
            "get"
          );
          console.log(response);
          if (response.data.success) {
            setAllVerifiedVendors(response.data.data.vendor);
          } else {
            setError("Failed to load vendors.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch vendors.");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllUsers();
    fetchAllProducts();
    fetchAllOrders();
    fetchAllUnVerifiedVendors();
    fetchAllVerifiedVendors();
  }, [user]);

  // const formData = new FormData(formRef.current);
  // console.log(formData);
  const submitCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(categoryFormRef.current);
    // formData.append("image", image);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      startLoading();
      const response = await FetchData(
        "categories/category/add",
        "post",
        formData,
        true
      );
      console.log(response);
      // setAddShowCategoryPopup(false);
      setHandlePopup((prev) => ({
        ...prev,
        addCategoryPopup: false,
      }));
      alert("Your category has been added successfully");
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const getAllMainSubcategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "categories/get-all-category-and-subcategories",
          "get"
        );
        // console.log(response);

        // Ensure categories exist before setting state
        setAllCategories(response.data?.data?.categories || []);
      } catch (error) {
        console.log("Error getting all main subcategories", error);
      } finally {
        stopLoading();
      }
    };

    getAllMainSubcategories();
  }, []);

  const submitSubCategory = async (e, categoryId) => {
    e.preventDefault();
    const formData = new FormData(subcategoryFormRef.current);
    // formData.append("image");
    // formData.append("category", categoryId); // Attach category ID

    // Debugging: Log form data before sending it
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      startLoading();
      const response = await FetchData(
        "categories/sub-category/add",
        "post",
        formData,
        true
      );
      console.log("Subcategory Added:", response);
      alert("Subcategory Added Successfully!");
      window.location.reload();

      setHandlePopup((prev) => ({
        ...prev,
        addSubCategory: false, // Close popup after submission
      }));
    } catch (error) {
      console.error("Error adding subcategory:", error);
    } finally {
      stopLoading();
    }
  };

  const handleEditSubcategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      startLoading();
      if (!handlePopup.selectedSubcategoryId) {
        alert("Subcategory ID is missing!");
        return;
      }

      const formData = new FormData(editSubcategoryFormRef.current);
      // formData.append("image", image);

      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await FetchData(
        `categories/edit-sub-category/${handlePopup.selectedSubcategoryId}`,
        "post",
        formData,
        true
      );

      console.log("Response:", response);
      alert("Subcategory Edited Successfully!");
      window.location.reload(); // Refresh page to reflect changes

      // Close popup and reset state
      setHandlePopup({
        editSubcategory: false,
        selectedSubcategoryId: null,
      });
    } catch (error) {
      console.error("Error editing subcategory:", error);
      alert("Failed to edit subcategory.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex min-h-screen">
      <motion.aside
        className="w-64 text-black p-4 shadow-lg fixed"
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
                activeSection === "Brands"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveSection("Brands")}
            >
              {<Package />}Brands
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
      <main className="flex-1 p-6 ml-64">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
        >
          {activeSection === "Users" && <Users />}
          {activeSection === "Vendors (Under review)" && <VendorUnderReview />}
          {activeSection === "Vendors (Verified)" && <VendorsVerified />}
          {activeSection === "Products" && <Products />}
          {activeSection === "Brands" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Brands</h2>
              <div className="overflow-x-auto">
                <InputBox
                  Type="text"
                  Value={searchTermBrands}
                  onChange={handleSearchBrands}
                  Placeholder={"Search by Brand ID or Brand name"}
                />
                <div>
                  <Button label={"Add new Brand"} />
                </div>
                <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
                  <thead>
                    <tr>
                      {tableHeadersBrands.map((header, index) => (
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
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <tr key={brand.id}>
                          <td className="border border-gray-500 px-4 py-2">
                            <Link to={`/current-brand/${brand._id}`}>
                              {brand._id}
                            </Link>
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {brand?.title}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {brand.adminName}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {brand.registeredOn}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {brand.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableHeadersOrder.length}
                          className="text-center py-4"
                        >
                          No brands found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeSection === "Orders" && <Orders />}
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

export default LoadingUI(Dashboard);
