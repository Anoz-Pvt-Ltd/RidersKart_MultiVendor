import React from "react";
import { useSelector } from "react-redux";

const DeliveryInstructions = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const userId = user.length > 0 ? user[0]._id : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-600">
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
                Other Cities & Rural Locations:
              </h3>
              <p className="text-gray-600">5-7 business days</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-1">
                Same City Delivery (where the seller's store is located):
              </h3>
              <p className="text-gray-600">1-3 business days</p>
            </div>
            <p className="col-span-2">
              <span className="font-semibold text-gray-800"> Note: </span>
              Delivery timelines may vary depending on the product type,
              location, availability, courier partner, weather conditions, or
              other unforeseen logistical circumstances.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Delivery Charges
          </h2>
          <p className="text-gray-600">
            Delivery charges, if any, are mentioned at the time of checkout and
            are inclusive of applicable taxes.
          </p>
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
