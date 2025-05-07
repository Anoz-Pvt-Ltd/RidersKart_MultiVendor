import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
// import { useRef } from "react";
import LoadingUI from "../../Components/Loading";

const CategoriesUnderReview = () => {
  const { categories, status, error } = useSelector(
    (state) => state.categoryList
  );
  const tableHeadersCategories = [
    "Category ID",
    "Category Name",
    // "Price",
    "Status",
    "Creation date",
  ];

  const [searchTermCategories, setSearchTermCategories] = useState("");
  const [filteredCategory, setFilteredCategory] = useState(categories);

  const handleSearchCategory = (e) => {
    const searchValueCategory = e.target.value;
    setSearchTermCategories(searchValueCategory);

    if (searchValueCategory === "") {
      setFilteredCategory(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category._id.includes(searchValueCategory) ||
          category.title.toLowerCase().includes(searchValueCategory)
      );
      setFilteredCategory(filtered);
    }
  };

  useEffect(() => {
    setFilteredCategory(categories);
  }, [categories]);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <InputBox
          Type="text"
          Value={searchTermCategories}
          onChange={handleSearchCategory}
          Placeholder={"Search by ID or Name..."}
        />
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl">
          <thead>
            <tr>
              {tableHeadersCategories.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-500 px-4 py-2 bg-neutral-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCategory.length > 0 ? (
              filteredCategory.map((category) => (
                <tr key={category.id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-order/${category._id}`}
                    >
                      {category._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category?.title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category.status}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {category.createdAt}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersCategories.length}
                  className="text-center py-4"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CategoriesUnderReview;
