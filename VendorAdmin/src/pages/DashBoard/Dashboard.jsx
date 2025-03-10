import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { barData } from "../../constants/VendorDashboard.Home";
import Orders from "../Orders/Orders";
import Categories from "../Category/Category";
import Brands from "../Brands/Brands";
import ManageStocks from "../Manage_Stocks/ManageStocks";
import Products from "../Products/Products";
import WalletTransactions from "../Wallet_Transactions/WalletTransaction";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../utils/Slice/UserInfoSlice";
import { FetchData } from "../../utils/FetchFromApi";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";


const Dashboard = () => {
  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);
  const Dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
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

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // setLoading(true);
        const response = await FetchData(
          `vendors/vendor-profile/${user?.[0]?._id}`,
          "get"
        );
        // console.log(response);
        setVendor(response.data.data);
        // console.log(response);
      } catch (err) {
        setError("Failed to load vendor profile.");
      } finally {
        // setLoading(false);
      }
    };

    fetchVendor();
  }, [vendor]);

  const handleLogin = () => {
    navigate("/login");
  };
  const handleProfile = () => {
    navigate("/vendor-profile");
  };
  const [products, setProducts] = useState([]);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#FF5733",
          "#8E44AD",
          "#28B463",
          "#C70039",
          "#1ABC9C",
          "#FFC300",
        ],
      },
    ],
  });

  const fetchProducts = async () => {
    try {
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      console.log(response);

      const fetchedProducts = response.data.data || [];
      setProducts(fetchedProducts);
      console.log(fetchedProducts);

      // Aggregate stockQuantity by category
      const categoryData = {};
      fetchedProducts.forEach((product) => {
        const { category, stockQuantity } = product;
        if (category) {
          categoryData[category?.title] =
            (categoryData[category?.title] || 0) + stockQuantity;
        }
      });

      // Prepare pieData
      const labels = Object.keys(categoryData);
      const data = Object.values(categoryData);

      setPieData((prevPieData) => ({
        ...prevPieData,
        labels,
        datasets: [
          {
            ...prevPieData.datasets[0],
            data,
          },
        ],
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch products.");
    }
  };

  useEffect(() => {
    if (user?.[0]?._id) fetchProducts();
  }, [user]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "Orders":
        return <Orders />;
      case "Categories":
        return <Categories />;
      case "Brands":
        return <Brands />;
      case "Manage Stock":
        return <ManageStocks />;
      case "Products":
        return <Products />;
      case "Wallet Transactions":
        return <WalletTransactions />;
      case "Home":
      default:
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-evenly lg:w-full lg:items-center">
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Total Orders</h3>
                <p className="text-2xl font-bold">{allOrders?.length}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Products</h3>
                <p className="text-2xl font-bold">
                  {user?.[0]?.products?.length}
                </p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Rating</h3>
                <p className="text-2xl font-bold">
                  Avg:{user?.[0]?.ratings?.average}/Total:
                  {user?.[0]?.ratings?.reviewsCount}
                </p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Transactions (₹)</h3>
                <p className="text-2xl font-bold">2,02,14,448.18</p>
              </div>
            </div>

            <div className="flex justify-center items-center ">
              {/* <div className="bg-white shadow rounded p-4">
                <h3 className="text-gray-500 mb-4">Monthly Orders</h3>
                <Bar data={barData} />
              </div> */}
              <div className="bg-white shadow rounded p-4 lg:w-1/2 w-full ">
                <h3 className="text-gray-500 mb-4">
                  Category Wise Product's Count
                </h3>
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        );
    }
  };

  const Hamburger = () => {
    const [hamburger, showHamburger] = useState(false);
    const menuVariants = {
      hidden: { x: "-100%", opacity: 0 },
      visible: {
        x: "0%",
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      },
      exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" },
      },
    };
    return (
      <div className="  w-full lg:hidden bg-purple-600 flex justify-start py-5 ">
        <div className="flex justify-start items-center w-full gap-10">
          <button
            className={`ml-5 border rounded-lg p-1 text-white`}
            onClick={() => showHamburger(true)}
          >
            <Menu />
          </button>
          <h1>
            Hello, <span className="text-white">{user?.[0]?.name}</span>
          </h1>
        </div>

        {hamburger && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="dashboard w-full h-screen bg-gray-800 text-white flex flex-col absolute top-0 "
          >
            <div className="p-4 text-2xl font-bold bg-purple-600 flex justify-between items-center">
              <h1>Dashboard</h1>
              <button onClick={() => showHamburger(false)} className="">
                <X />
              </button>
            </div>
            <ul className="flex-1">
              {[
                "Home",
                "Orders",
                "Categories",
                "Brands",
                "Manage Stock",
                "Products",
                "Wallet Transactions",
              ].map((menu) => (
                <li
                  key={menu}
                  className={`p-4 hover:bg-gray-700 cursor-pointer ${
                    selectedMenu === menu ? "bg-gray-700" : ""
                  }`}
                  onClick={() => setSelectedMenu(menu)}
                >
                  {menu}
                </li>
              ))}
            </ul>
            <div className="mb-10 w-full flex flex-col gap-5 justify-center items-center p-5">
              {user?.length > 0 ? (
                <div className="flex flex-col justify-center items-center gap-5 w-full">
                  <Button
                    label={"View Profile"}
                    className={"w-full"}
                    onClick={handleProfile}
                  />
                  <Button
                    label={"Logout"}
                    className={"w-full"}
                    onClick={() => {
                      Dispatch(clearUser());
                      localStorage.removeItem("AccessToken");
                      localStorage.removeItem("RefreshToken");
                      alert("You are logged out! Please log in.");
                      setTimeout(() => navigate("/login"), 100);
                      console.log(localStorage.getItem("RefreshToken"));
                    }}
                  />
                </div>
              ) : (
                <Button
                  label={"Login"}
                  className={"w-full"}
                  onClick={handleLogin}
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="flex lg:flex-row flex-col h-screen bg-gray-100">
      <div className="dashboard w-64 bg-gray-800 text-white lg:flex flex-col hidden ">
        <div className="p-4 text-2xl font-bold bg-purple-600">Dashboard</div>
        <ul className="flex-1">
          {[
            "Home",
            "Orders",
            "Categories",
            "Brands",
            "Manage Stock",
            "Products",
            "Wallet Transactions",
          ].map((menu) => (
            <li
              key={menu}
              className={`p-4 hover:bg-gray-700 cursor-pointer ${
                selectedMenu === menu ? "bg-gray-700" : ""
              }`}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
        <div className="mb-10 w-full flex flex-col gap-5 justify-center items-center p-5">
          {user?.length > 0 ? (
            <div className="flex flex-col justify-center items-center gap-5 w-full">
              <Button
                label={"View Profile"}
                className={"w-full"}
                onClick={handleProfile}
              />
              <Button
                label={"Logout"}
                className={"w-full"}
                onClick={() => {
                  Dispatch(clearUser());
                  alert("you are logged Out! Please log in");
                  navigate("/login");
                }}
              />
            </div>
          ) : (
            <Button
              label={"Login"}
              className={"w-full"}
              onClick={handleLogin}
            />
          )}
        </div>
      </div>
      <div>
        <Hamburger />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
