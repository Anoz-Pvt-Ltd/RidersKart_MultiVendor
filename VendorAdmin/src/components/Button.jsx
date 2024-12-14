import React from "react";

const Button = ({ onClick, className, label, Type }) => {
  return (
    <button
      type={Type}
      onClick={onClick}
      className={`bg-white text-blue-600 px-4 py-2 rounded hover:bg-green-500 hover:text-black duration-300 ease-in-out hover:shadow-md shadow-neutral-600 hover:translate-y-1 border border-neutral-300 hover:border-none ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
