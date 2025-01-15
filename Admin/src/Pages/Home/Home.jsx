import React, { useState } from "react";

const Dashboard = () => {
  const [productsSoldOut, setProductsSoldOut] = useState(1);
  const [lowStock, setLowStock] = useState(0);
  const [approvedSellers, setApprovedSellers] = useState(6);
  const [notApprovedSellers, setNotApprovedSellers] = useState(118);
  const [deactivatedSellers, setDeactivatedSellers] = useState(0);

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white">
        <nav className="space-y-2 p-4">
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">
            Dashboard
          </a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">
            Orders
          </a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">
            Categories
          </a>
          {/* Add more sidebar items here */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-4/5 p-4 space-y-4">
        {/* Top Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800 font-bold">Total Earnings ($)</p>
            <p className="text-xl">$22,014,874.54</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-bold">Admin Earnings ($)</p>
            <p className="text-xl">$12.00</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800 font-bold">Seller Earnings ($)</p>
            <p className="text-xl">$22,014,862.54</p>
          </div>
        </div>

        {/* Product Notifications */}
        {productsSoldOut > 0 && (
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-red-800 font-bold">
              {productsSoldOut} Product(s) sold out!
            </p>
            <a href="#" className="text-red-500 underline">
              More info
            </a>
          </div>
        )}
        {lowStock > 0 && (
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800 font-bold">
              {lowStock} Product(s) low in stock!
            </p>
            <a href="#" className="text-blue-500 underline">
              More info
            </a>
          </div>
        )}

        {/* Seller Details */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-100 rounded-lg text-center">
            <p className="text-green-800 font-bold">Approved Sellers</p>
            <p className="text-xl">{approvedSellers}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg text-center">
            <p className="text-yellow-800 font-bold">Not Approved Sellers</p>
            <p className="text-xl">{notApprovedSellers}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg text-center">
            <p className="text-red-800 font-bold">Deactivated Sellers</p>
            <p className="text-xl">{deactivatedSellers}</p>
          </div>
        </div>

        {/* Sellers Table */}
        <div>
          <h2 className="text-lg font-bold mb-2">Top Sellers</h2>
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Seller Name</th>
                <th className="py-2 px-4 text-left">Store Name</th>
                <th className="py-2 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4">1255</td>
                <td className="py-2 px-4">Super Market</td>
                <td className="py-2 px-4">Metro Merchants Mart</td>
                <td className="py-2 px-4">21217644.68</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>

        {/* Categories Table */}
        <div>
          <h2 className="text-lg font-bold mb-2">Top Categories</h2>
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="w-full bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Category Name</th>
                <th className="py-2 px-4 text-left">Clicks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4">61</td>
                <td className="py-2 px-4">Smartphone</td>
                <td className="py-2 px-4">94192</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
