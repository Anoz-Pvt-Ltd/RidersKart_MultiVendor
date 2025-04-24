import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Optional icons

const InputBox = ({
  LabelName,
  Placeholder,
  className = "",
  Type = "text",
  Name,
  Value,
  onChange,
  DisableRequired = false,
  Required = true,
  Min,
  Max,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = Type === "password";

  return (
    <div className="flex justify-center items-center w-full">
      <div className="py-4 w-full relative">
        <label
          htmlFor={Name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {LabelName}
        </label>
        <input
          id={Name}
          name={Name}
          type={isPasswordField ? (showPassword ? "text" : "password") : Type}
          value={Value}
          onChange={!DisableRequired ? onChange : undefined}
          placeholder={Placeholder}
          required={Required}
          disabled={DisableRequired}
          min={Min}
          max={Max}
          className={`w-full px-4 py-2 border rounded-md outline-none transition duration-200 ease-in-out 
            ${
              DisableRequired
                ? "bg-gray-200 cursor-not-allowed"
                : "text-gray-700 bg-white border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md"
            } 
            ${className}`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-14 right-0 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputBox;
