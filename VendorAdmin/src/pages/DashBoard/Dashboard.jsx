import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { barData, pieData } from "../../constants/VendorDashboard.Home";
// import Orders from "./Orders";
// import Categories from "./Categories";
// import Brands from "./Brands";
// import ManageStocks from "./ManageStocks";
// import Products from "./Products";
// import WalletTransactions from "./WalletTransactions";
import Orders from "../Orders/Orders";
import Categories from "../Category/Category";
import Brands from "../Brands/Brands";
import ManageStocks from "../Manage_Stocks/ManageStocks";
import Products from "../Products/Products";
import WalletTransactions from "../Wallet_Transactions/WalletTransaction";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

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
                <p className="text-2xl font-bold">4150</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Products</h3>
                <p className="text-2xl font-bold">311</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Rating</h3>
                <p className="text-2xl font-bold">4/123</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h3 className="text-gray-500">Balance (₹)</h3>
                <p className="text-2xl font-bold">2,14,448.18</p>
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
        <div className="mb-10 w-full flex justify-center items-center p-5">
          <Button label={"Login"} className={"w-full"} onClick={handleLogin} />
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
