import React, { useState } from "react";

const InputBox = ({ LabelName, Placeholder, className, Type }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="p-4 w-full">
        <label
          htmlFor="input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {LabelName}
        </label>
        <input
          //   id="input"
          type={Type}
          placeholder={Placeholder}
          className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
        />
      </div>
    </div>
  );
};

export default InputBox;
