import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // for close icon

const UserTC = ({ isOpen, onClose }) => {
  // if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className=" rounded-2xl shadow-2xl w-full max-h-[80vh] flex flex-col overflow-hidden lg:px-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold">Terms & Conditions</h2>
          {/* <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <X size={20} />
            </button> */}
        </div>

        {/* Scrollable content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-gray-600">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-1">1. Introduction</h3>
            <p>
              Welcome to our e-commerce platform. By accessing or using our
              services, you agree to comply with and be bound by these Terms and
              Conditions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold mb-1">2. User Responsibilities</h3>
            <p>
              Users must provide accurate information when registering an
              account and agree not to misuse the platform for fraudulent
              activities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-1">3. Payments & Refunds</h3>
            <p>
              All transactions are secure. Refunds are subject to our return
              policy and may take 5–7 business days to process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold mb-1">4. Limitation of Liability</h3>
            <p>
              We are not liable for indirect, incidental, or consequential
              damages resulting from the use of our platform.
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        {/* <div className="p-5 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Decline
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Accept
            </button>
          </div> */}
      </motion.div>
      {/* <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
      </motion.div> */}
    </AnimatePresence>
  );
};

export default UserTC;
