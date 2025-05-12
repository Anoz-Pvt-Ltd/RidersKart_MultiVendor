import React from "react";

const TermsConditionsVendors = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Vendor's Policy
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Introduction
          </h2>
          <p className="text-gray-600 mb-4">
            RidersKart.in (“RidersKart” or “Platform”) is a{" "}
            <span className="font-semibold">
              multi-vendor e-commerce marketplace
            </span>{" "}
            facilitating sellers to list, market, and sell their products to
            customers across India. This Seller Policy governs the conduct,
            responsibilities, and rights of sellers using the platform. By
            registering as a seller, you (“Seller”, “You”, or “Vendor”) agree to
            comply with the terms laid out herein, which are in accordance with
            the{" "}
            <span className="font-semibold">
              Consumer Protection (E-Commerce) Rules, 2020
            </span>
            , issued by the Government of India.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Seller Eligibility & Onboarding
          </h2>
          <ol className="list-disc pl-5 space-y-2 text-gray-600">
            {/* <li>
              Contact our support team at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>{" "}
              with your order number.
            </li> */}
            <li>
              Sellers must have valid business registration (GSTIN, PAN, Bank
              Account, etc.).
            </li>
            <li>
              Sellers are required to submit identity proof, address proof, and
              other KYC documents as requested.
            </li>
            <li>
              Sellers must agree to abide by RidersKart’s code of conduct,
              product policies and Indian e-commerce regulations.
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Product Listing & Quality Compliance
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              All products listed must be new, genuine, and comply with BIS
              standards (where applicable).
            </li>
            <li>
              No counterfeit, refurbished, expired, or banned items are allowed.
            </li>
            <li>
              Product listings must include accurate descriptions, images,
              sizes, warranties, and pricing.
            </li>
            <li>
              Sellers are fully responsible for ensuring the accuracy of
              listings and quality of delivered products.
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Pricing, Inventory & Stock
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <ul className="list-disc mt-1 space-y-1 text-gray-600">
              <li>
                Sellers are responsible for updating stock and pricing in real
                time.
              </li>
              <li>
                False availability or price manipulation is strictly prohibited.
              </li>
              <li>
                Surge pricing, misleading discounts, and deceptive offers are
                disallowed as per consumer protection laws.
              </li>
            </ul>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold  text-gray-700 mb-3">
            Order Fulfillment & Delivery Timeline
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">Delivery Responsibilities</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  Sellers must dispatch orders within 24–48 hours of
                  confirmation.
                </li>
                <li>
                  Delivery within the same city (where store is located) must be
                  completed in 1–3 working days.
                </li>
                <li>
                  Delivery to other cities or rural areas must be completed in
                  5–7 working days.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Packaging Standards</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  Sellers must ensure tamper-proof, safe, and brand-appropriate
                  packaging.
                </li>
                <li>
                  Sellers bear liability for damages arising due to poor
                  packaging or delayed dispatch.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Returns, Replacements & Cancellations
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">Return Eligibility</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  Buyers may request returns within 7 days for valid reasons
                  such as:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Damaged, defective, or incorrect product</li>
                    <li>Size or fit issues (for applicable categories)</li>
                    <li>Product not matching description</li>
                  </ul>
                </li>
                <li>
                  All returned items must be inspected before refunds are
                  processed.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Seller Accountability</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  Sellers are responsible for bearing the cost of reverse
                  logistics and refund processing in case of:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Product defect</li>
                    <li>Incorrect product delivered</li>
                    <li>Policy-compliant return by customer</li>
                  </ul>
                </li>
                <li>
                  RidersKart reserves the right to deduct refund amounts from
                  the seller payout if a return or refund is approved.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Payment Settlement Policy
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">Payment Schedule</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  Payments for delivered and non-returned orders will be
                  disbursed to the seller’s bank account within 4–5 business
                  days after delivery confirmation.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Refund Deductions</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  In case of customer-initiated return/refund (approved under
                  platform policy), the seller will not receive payment for the
                  order.
                </li>
                <li>
                  If the payment has already been released and the return is
                  approved later, the amount will be adjusted in the next payout
                  cycle.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Customer Interaction & Complaint Handling
          </h2>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
            <li>
              Sellers must not directly contact customers for order-related
              issues unless authorized.
            </li>
            <li>
              All customer service and disputes must be managed via the
              RidersKart support system.
            </li>
            <li>
              Sellers are expected to resolve complaints swiftly and
              professionally in accordance with Consumer Protection Rules.
            </li>
          </ul>
          {/* <ol className="list-decimal pl-5 space-y-2">
            <li>
            </li>
          </ol> */}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Intellectual Property & Brand Protection
          </h2>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
            <li>
              Sellers must not list products infringing any third-party
              trademark, copyright, or brand name.
            </li>
            <li>
              RidersKart holds the right to remove listings, suspend accounts,
              and take legal action for IP violations.
            </li>
            <li>
              Sellers grant RidersKart the non-exclusive right to use product
              content for marketing and sales.
            </li>
          </ul>

          {/* <ol className="list-decimal pl-5 space-y-2">
            <li>
            </li>
          </ol> */}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Legal Compliance & Dispute Resolution
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">Governing Law</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  This policy is governed by the laws of India, and any disputes
                  will be subject to the exclusive jurisdiction of the courts of
                  Patna, Bihar where RidersKart is registered.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Dispute with Seller</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  In case of any dispute arising from:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Quality issues</li>
                    <li>Policy violations</li>
                    <li>Misconduct or fraud</li>
                  </ul>
                </li>
                <li>
                  RidersKart reserves the right to:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Withhold or cancel payouts</li>
                    <li>Delist the seller temporarily or permanently</li>
                    <li>
                      Pursue legal action for financial or reputational damages
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Platform Rights & Policy Updates
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-medium">RidersKart Rights</span>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                <li>
                  RidersKart reserves the right to:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Modify seller policies</li>
                    <li>Impose penalties for non-compliance</li>
                    <li>
                      Terminate seller accounts in case of repeated violations
                    </li>
                  </ul>
                </li>
                <li>
                  Any policy change will be communicated to sellers via email or
                  platform notification, and continued usage implies acceptance.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Indemnity Clause
          </h2>
          <span className="text-gray-600">
            Sellers shall indemnify and hold harmless RidersKart, its
            affiliates, directors, and employees from any claim, liability,
            cost, or loss arising from:
          </span>
          <ol className="list-decimal pl-5 space-y-2">
            <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
              <li>Product liability or safety issues</li>
              <li>False representations or misleading listings</li>
              <li>Breach of applicable laws or customer rights</li>
              <li>Infringement of third-party IP or contractual obligations</li>
            </ul>
          </ol>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700">
            Contact us at{" "}
            <a
              href="mailto:sellersupport@riderskart.in"
              className="font-semibold hover:underline"
            >
              sellersupport@riderskart.in
            </a>{" "}
            for any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsVendors;
