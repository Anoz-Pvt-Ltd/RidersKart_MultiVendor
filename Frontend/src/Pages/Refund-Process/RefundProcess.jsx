import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Refund Policy</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Our Refund Policy
          </h2>
          <p className="text-gray-600 mb-4">
            You can request a refund within{" "}
            <span className="font-semibold">30 days</span> of purchase if the
            item is unused and in its original packaging.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            How to Request a Refund
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>
              Contact our support team at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>{" "}
              with your order number.
            </li>
            <li>
              Return the item (if required) to our return address provided in
              the email.
            </li>
            <li>
              Once received, we’ll process your refund within{" "}
              <span className="font-semibold">5-7 business days</span>.
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Refund Methods
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              <span className="font-semibold">Credit/debit card:</span> 3-5
              business days
            </li>
            <li>
              <span className="font-semibold">Store credit:</span> Instant
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700">
            Contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold hover:underline"
            >
              support@example.com
            </a>{" "}
            for any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
