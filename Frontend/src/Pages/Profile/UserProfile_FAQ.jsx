import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const UserFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking link via email or SMS. You can also track it directly in the 'My Orders' section of your account.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 7-day return policy for most products. Items must be unused and in their original packaging to be eligible for return.",
    },
    {
      question: "Do you offer cash on delivery?",
      answer:
        "Yes, we provide cash on delivery (COD) for selected locations. You can check availability at checkout.",
    },
    {
      question: "How long will delivery take?",
      answer:
        "Delivery usually takes 3–7 business days depending on your location. Remote areas may take slightly longer.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Absolutely! We use SSL encryption and trusted payment gateways like Razorpay, PayPal, and Stripe for maximum security.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mx-auto lg:p-6 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="border rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-medium text-left">{faq.question}</span>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  className="px-4 pb-4 text-gray-600 text-sm leading-relaxed bg-white"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserFAQ;
