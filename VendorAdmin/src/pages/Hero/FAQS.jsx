// src/components/VendorFAQ.jsx

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I register as a seller?",
    answer:
      "Simply click on the 'Register Now' button, fill in your business details, and upload the required documents. Once verified, your store will go live.",
  },
  {
    question: "How will I get paid?",
    answer:
      "Payments are transferred securely to your registered bank account. Payouts are processed on a weekly or bi-weekly basis depending on your sales.",
  },
  {
    question: "Do I need to manage shipping?",
    answer:
      "No, we provide complete logistics and delivery support. You just need to pack your products, and our courier partners handle the rest.",
  },
  {
    question: "Are there any fees for selling?",
    answer:
      "We charge a small commission on each successful sale. There are no upfront costs or hidden charges for registering as a vendor.",
  },
  {
    question: "Can I track my sales performance?",
    answer:
      "Yes, you get access to a vendor dashboard with real-time analytics, sales reports, and insights to grow your business.",
  },
];

const VendorFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-4 md:px-10 lg:px-20 w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 rounded-lg shadow-md"
            >
              {/* Question Row */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-700">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-gray-500 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Answer Section with Animation */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 pb-4 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorFAQ;
