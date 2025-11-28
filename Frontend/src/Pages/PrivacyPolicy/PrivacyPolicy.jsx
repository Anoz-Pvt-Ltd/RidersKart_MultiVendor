import React from "react";
import { motion } from "framer-motion";

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-6 md:p-10"
      >
        <motion.h1
          variants={sectionVariant}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center"
        >
          Privacy Policy
        </motion.h1>

        {/* Section 1 */}
        <motion.div variants={sectionVariant} className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            1. Payment Terms
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 leading-relaxed">
            <li>
              <strong>Accepted Payment Methods:</strong> We accept payments via
              Credit Cards, Debit Cards, Net Banking, UPI, Wallets, and all
              Razorpay-supported modes.
            </li>
            <li>
              <strong>Transaction Charges:</strong> Any applicable transaction
              or convenience fee will be shown during checkout.
            </li>
            <li>
              <strong>Payment Confirmation:</strong> A confirmation email/SMS
              will be sent upon successful payment.
            </li>
            <li>
              <strong>Security:</strong> All payments are securely processed
              through Razorpay with encryption and fraud protection.
            </li>
            <li>
              <strong>Auto-Debit & Recurring Payments:</strong> Users subscribed
              to recurring services must authorize auto-debit, which can be
              modified anytime.
            </li>
          </ul>
        </motion.div>

        {/* Section 2 */}
        <motion.div variants={sectionVariant} className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            2. Order Processing & Delivery
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 leading-relaxed">
            <li>
              <strong>Order Confirmation:</strong> Orders are processed after
              successful payment verification.
            </li>
            <li>
              <strong>Service Fulfillment:</strong> Delivery timelines depend on
              the service category and will be communicated during booking.
            </li>
            <li>
              <strong>Processing Time:</strong> Orders are processed within 1–7
              business days.
            </li>
            <li>
              <strong>Failed Transactions:</strong> In case of payment failure,
              customers should retry using a valid payment method.
            </li>
          </ul>
        </motion.div>

        {/* Section 3 */}
        <motion.div variants={sectionVariant} className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            3. Refund & Cancellation Policy
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 leading-relaxed">
            <li>
              <strong>Cancellation by Customer:</strong> Orders can be canceled
              before shipping or delivery processing.
            </li>
            <li>
              <strong>Refund Eligibility:</strong> Refunds apply to failed
              transactions, duplicate payments, and non-fulfilled services.
            </li>
            <li>
              <strong>Refund Timeline:</strong> Approved refunds are processed
              within 7–10 business days to the original payment source.
            </li>
            <li>
              <strong>Non-Refundable Payments:</strong> Payments for delivered
              or completed services are non-refundable.
            </li>
            <li>
              <strong>Chargebacks & Disputes:</strong> Users should contact
              support before initiating a bank chargeback.
            </li>
          </ul>
        </motion.div>

        {/* Section 4 */}
        <motion.div variants={sectionVariant} className="mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            4. Fraud Prevention & Security Measures
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 leading-relaxed">
            <li>
              <strong>Transaction Monitoring:</strong> We track transactions to
              prevent fraud and may cancel suspicious orders.
            </li>
            <li>
              <strong>Unauthorized Transactions:</strong> Report unauthorized
              payments to <strong>support@riderskart.in</strong> within 24
              hours.
            </li>
          </ul>
        </motion.div>

        {/* Section 5 */}
        <motion.div variants={sectionVariant} className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            5. Contact & Support
          </h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            For any payment-related questions, reach out to us:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> support@riderskart.in
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> 9599350524
          </p>
        </motion.div>

        <motion.p
          variants={sectionVariant}
          className="text-center text-gray-600 mt-6 text-sm"
        >
          By making a payment on our platform, you agree to the terms stated in
          this Payment & Refund Policy.
        </motion.p>
      </motion.div>
    </div>
  );
}
