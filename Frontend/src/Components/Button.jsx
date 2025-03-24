import React from "react";

const Button = ({ onClick, className, label, type, Disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={Disabled}
      className={`${className}  text-blue-600 px-4 py-2 rounded  duration-300 ease-in-out hover:shadow-md shadow-neutral-600 hover:translate-y-1 border border-neutral-300 hover:border-none `}
    >
      {label}
    </button>
  );
};

export default Button;
