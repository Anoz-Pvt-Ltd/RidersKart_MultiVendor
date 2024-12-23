const SelectBox = ({
  LabelName,
  Name,
  Value,
  Placeholder,
  Options,
  onChange,
  className,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={Name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {LabelName}
      </label>
      <select
        id={Name}
        name={Name}
        value={Value}
        onChange={onChange}
        className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
      >
        <option value="" disabled>
          {Placeholder}
        </option>
        {Options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
