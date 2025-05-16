import React from "react";

const Button = ({ onClick, className, label, type, Disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={Disabled}
      className={`bg-[#DF3F33] px-4 py-2 rounded-2xl drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out ${className} text-white `}
      // className={`${className}  text-blue-600 px-4 py-2 rounded  duration-300 ease-in-out hover:shadow-md shadow-neutral-600 hover:translate-y-1 border border-neutral-300 hover:border-none `}
    >
      {label}
    </button>
  );
};

export default Button;
