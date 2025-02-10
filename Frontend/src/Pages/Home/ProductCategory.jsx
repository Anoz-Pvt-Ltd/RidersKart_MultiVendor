import React from "react";
import { categories } from "../../Constants/ProductCategory.js";
import { useState } from "react";

const ProductCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [clickedCategory, setClickedCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setClickedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <div className="bg-white py-4 shadow relative rounded-b-lg">
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 px-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={(e) => {
              const relatedTarget = e.relatedTarget;
              if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
                setHoveredCategory(null);
              }
            }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="text-3xl">{category.icon}</div>
            <div className="text-sm font-medium text-gray-700">
              {category.name}
            </div>
            {(hoveredCategory === category.name ||
              clickedCategory === category.name) &&
              category.subcategories.length > 0 && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-10"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <ul className="py-2">
                    {category.subcategories.map((subcategory, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {subcategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
