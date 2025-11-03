import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Policies = ({ categorizedPolicies }) => {
  const [openCategory, setOpenCategory] = useState(null);

  if (!categorizedPolicies) return null;

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="space-y-2 text-gray-700 text-sm">
      {Object.entries(categorizedPolicies).map(([category, policies]) => (
        <div
          key={category}
          className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Header */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h2 className="font-semibold capitalize text-gray-800">
              {category.replace(/([A-Z])/g, " $1")} Policies
            </h2>
            <motion.div
              animate={{ rotate: openCategory === category ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {openCategory === category && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="overflow-hidden bg-white"
              >
                <div className="gap-4 p-6 w-full ">
                  {policies.map((policy) => (
                    <motion.div
                      key={policy._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-all w-full"
                    >
                      <h3 className="text-lg font-semibold text-black">
                        {policy.title}
                      </h3>
                      <h3>{policy.policy}</h3>
                      <span className="block mb-2">
                        <span className="text-black font-semibold">T&C's:</span>{" "}
                        {policy.termsAndConditions}
                      </span>

                      <p className="mb-3">
                        <span className="text-black font-semibold">
                          Summary:
                        </span>{" "}
                        {policy.shortSummary}
                      </p>

                      <p className="mb-3">
                        <span className="text-black font-semibold">
                          Detailed:
                        </span>{" "}
                        {policy.description}
                      </p>

                      <div className="text-xs space-y-1 text-gray-600">
                        {policy.effectiveDate && (
                          <p>
                            <strong>Effective:</strong>{" "}
                            {new Date(
                              policy.effectiveDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                        {policy.expiryDate && (
                          <p>
                            <strong>Expires:</strong>{" "}
                            {new Date(policy.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                        {policy.region !== "global" && (
                          <p>
                            <strong>Region:</strong>{" "}
                            {[policy.city, policy.state, policy.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Policies;
