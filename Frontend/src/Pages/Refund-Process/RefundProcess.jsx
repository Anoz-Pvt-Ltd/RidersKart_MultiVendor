import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Refund Policy</h1>

        {/* refund timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Refund Timelines
          </h2>
          <p className="text-gray-600 mb-4">
            Once the returned product is received and inspected by the seller,
            the refund process will be initiated. Refunds will be processed
            within
            <span className="font-semibold"> 7–10 business days</span> to the
            original payment method.
          </p>
          <ul className="text-gray-600 mb-4 mx-5 list-disc">
            <li className="">
              In case of
              <span className="font-semibold"> Cash on Delivery (COD)</span>
              orders, customers will be required to provide bank account details
              for refund processing.
            </li>
            <li className="">
              In some cases, the refund may be offered as{" "}
              <span className="font-semibold">store credit or coupon</span>, if
              preferred.
            </li>
          </ul>
        </div>

        {/* Non-Refundable Conditions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Non-Refundable Conditions
          </h2>
          <p className="text-gray-600 mb-4">
            No refunds will be provided in the following cases:
          </p>
          <ul className="text-gray-600 mb-4 mx-5 list-disc">
            <li>
              Product is returned without original packaging, accessories, or
              tags.
            </li>
            <li>Return reason is invalid or not approved by the seller.</li>
            <li>Product has been tampered with or used.</li>
            <li>Late return request after the specified window (7 days).</li>
            <li>
              Disputes that do not comply with the guidelines outlined herein.
            </li>
          </ul>
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
                support@riderskart.in
              </a>{" "}
              with your order number.
            </li>
            <li>
              Return the item (if required) to our to our delivery person.
              He/she will inspect the product first before accepting the return
              request.
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
      </div>

      {/* Return Policies */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-5 text-gray-600">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Return Policy</h1>

        <div className="mb-8 text-gray-600">
          <p>
            We understand that at times, returns may be necessary. The return
            policy may vary depending on the seller and product category;
            however, the following general rules apply:
          </p>
        </div>

        {/* Return Eligibility */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Return Eligibility
          </h2>
          <p className="text-gray-600 mb-4">
            A product is eligible for return under the following conditions:
          </p>
          <ul className="text-gray-600 mb-4 mx-5 list-disc">
            <li className="">
              Received a damaged, defective, or incorrect product.
            </li>
            <li> Product is different from what was shown on the website.</li>
            <li>
              Size or fit issues, only if applicable for the product category.
            </li>
            <li>
              Product has manufacturing defects and is within the return period.
            </li>
          </ul>

          <p className="mb-4">
            Returns must be requested within 7 days of delivery, with valid
            photographic or video proof submitted along with the return request.
          </p>
          <p className="mb-4">
            <span className="font-semibold ">Note: </span>
            Certain categories such as perishable items, inner-wear, personal
            hygiene products, customized or made-to-order goods, and items
            marked as "non-returnable" are not eligible for return.
          </p>
        </div>

        {/* Return Approval Process */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Return Approval Process
          </h2>
          <ul className="text-gray-600 mb-4 mx-5 list-disc">
            <li>
              All return requests are subject to review and approval by the
              seller and RidersKart support team.
            </li>
            <li>
              The seller reserves the right to decline return requests if:
              <li>
                The product has been used, damaged after delivery, or is not in
                its original packaging.
              </li>
              <li>Return is initiated after the return window.</li>
              <li>Product returned is not the same as delivered.</li>
            </li>
          </ul>
        </div>
        {/* Return Pick-up and Conditions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Return Pick-up and Conditions
          </h2>
          <ul className="text-gray-600 mb-4 mx-5 list-disc">
            <li>
              Pick-up will be arranged by RidersKart’s logistics partners
              wherever available.
            </li>
            <li>
              The product must be returned in{" "}
              <span className="font-semibold">unused condition</span> with all
              original tags, packaging, and accessories.
            </li>
          </ul>
        </div>

        {/* Need help */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700">
            Contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="font-semibold hover:underline"
            >
              support@riderskart.in
            </a>{" "}
            for any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
