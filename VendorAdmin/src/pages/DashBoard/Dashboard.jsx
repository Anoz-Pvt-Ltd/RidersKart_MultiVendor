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

const Dashboard = () => {
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);
  const Dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // setLoading(true);
        const response = await FetchData(
          `vendors/vendor-profile/${user?.[0]?._id}`,
          "get"
        );
        console.log(response);
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
  // console.log(user?.[0]?._id);

  const fetchProducts = async () => {
    try {
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      console.log(response);

      const fetchedProducts = response.data.data || [];
      setProducts(fetchedProducts);

      // Aggregate stockQuantity by category
      const categoryData = {};
      fetchedProducts.forEach((product) => {
        const { category, stockQuantity } = product;
        if (category) {
          categoryData[category?.main] =
            (categoryData[category?.main] || 0) + stockQuantity;
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
          <div>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Orders</h3>
                {/* <p className="text-2xl font-bold">{user?.[0]?.order}</p> */}
                <p className="text-2xl font-bold">order</p>
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
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white shadow rounded p-4">
                <h3 className="text-gray-500 mb-4">Monthly Orders</h3>
                <Bar data={barData} />
              </div>
              <div className="bg-white shadow rounded p-4">
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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white flex flex-col">
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

      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
