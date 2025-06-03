import React from "react";

const Policies = ({ categorizedPolicies }) => {
  if (!categorizedPolicies) return;
  return (
    <div className='space-y-8 text-gray-700'>
      {Object.entries(categorizedPolicies).map(([category, policies]) => (
        <div key={category} className='policy-category-section'>
          <h2 className=' font-semibold mb-4 capitalize'>
            {category.replace(/([A-Z])/g, " $1")} Policies
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {policies.map((policy) => (
              <div
                key={policy._id}
                className='border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow'
              >
                <h3 className='text-lg text-black'>{policy.title}</h3>
                <h3 className=' text-sm'>{policy.policy}</h3>
                <span className='mb-2 text-sm'>
                  <span className='text-black font-semibold'>Terms:</span>{" "}
                  {policy.termsAndConditions}
                </span>

                <p className='text-sm mb-3'>
                  <span className='text-black font-semibold'>Summery:</span>{" "}
                  {policy.shortSummary}
                </p>

                <div className='text-xs space-y-1'>
                  {policy.effectiveDate && (
                    <p>
                      <strong>Effective:</strong>{" "}
                      {new Date(policy.effectiveDate).toLocaleDateString()}
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

                {/* <button
                  className='mt-3 text-sm text-blue-600 hover:underline'
                  onClick={() => console.log("View details", policy._id)}
                >
                  View Full Policy
                </button> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Policies;
