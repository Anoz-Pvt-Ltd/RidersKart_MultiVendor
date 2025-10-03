// src/components/VendorHighlights.jsx

import React from "react";
import {
  FaUsers,
  FaStore,
  FaShippingFast,
  FaMoneyBillWave,
  FaChartLine,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaStore className="text-red-600 text-3xl" />,
    title: "Start Selling Quickly",
    description:
      "Register your store in minutes and start showcasing your products to thousands of customers.",
  },
  {
    icon: <FaUsers className="text-red-600 text-3xl" />,
    title: "Large Customer Base",
    description:
      "Access a growing marketplace with a wide customer network across different categories.",
  },
  {
    icon: <FaShippingFast className="text-red-600 text-3xl" />,
    title: "Seamless Logistics",
    description:
      "We handle delivery and logistics so you can focus on growing your business.",
  },
  {
    icon: <FaMoneyBillWave className="text-red-600 text-3xl" />,
    title: "Secure & Fast Payments",
    description:
      "Receive timely payouts directly into your bank account with secure payment systems.",
  },
  {
    icon: <FaChartLine className="text-red-600 text-3xl" />,
    title: "Sales & Growth Insights",
    description:
      "Track your sales performance, revenue trends, and customer demand with powerful analytics.",
  },
  {
    icon: <FaHeadset className="text-red-600 text-3xl" />,
    title: "Dedicated Seller Support",
    description:
      "Get assistance anytime with our dedicated vendor support and onboarding guidance.",
  },
];

const VendorHighlights = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Why Sell With Us?
        </h2>
        <p className="text-gray-500 mb-12">
          Join our marketplace and grow your business with trusted logistics,
          secure payments, and access to a vast customer base.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorHighlights;
