import React from "react";

const InputBox = ({
  LabelName = "",
  Placeholder = "",
  className = "",
  Type = "text",
  Name = "",
  Value = "",
  onChange,
  Required = true,
  keyPress,
}) => {

  return (
    <div className='flex justify-center items-center w-full'>
      <div className='py-4 w-full'>
        <label
          htmlFor={Name}
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          {LabelName}
        </label>
        <input
          id={Name}
          name={Name}
          type={Type}
          value={Value}
          onChange={onChange}
          placeholder={Placeholder}
          required={Required}
          className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && typeof keyPress === "function") {
              keyPress(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default InputBox;
