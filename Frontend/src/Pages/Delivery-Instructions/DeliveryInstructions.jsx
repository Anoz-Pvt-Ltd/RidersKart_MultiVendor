import React from "react";
import { useSelector } from "react-redux";

const DeliveryInstructions = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const userId = user.length > 0 ? user[0]._id : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Shipping & Delivery
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Shipping Options
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-1">
                Standard Shipping
              </h3>
              <p className="text-gray-600">3-5 business days</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-1">
                Express Shipping
              </h3>
              <p className="text-gray-600">1-2 business days</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Tracking Your Order
          </h2>
          <p className="text-gray-600">
            Once your order is shipped, you’ll receive a tracking link via
            email. You can also check status in your{" "}
            <a
              href={`/user-profile/dashboard/${userId}`}
              className="text-blue-600 hover:underline"
            >
              account dashboard
            </a>
            .
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Change Delivery Address?
          </h2>
          <p className="text-gray-600">
            Contact us within <span className="font-semibold">24 hours</span> of
            ordering at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@example.com
            </a>
            .
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Delivery Issues?
          </h3>
          <p className="text-yellow-700">
            If your package is late, damaged, or missing, email us at{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold hover:underline"
            >
              support@example.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInstructions;
