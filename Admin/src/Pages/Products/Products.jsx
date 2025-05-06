import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FetchData } from "../../Utility/FetchFromApi";
import { Link } from "react-router-dom";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { useRef } from "react";
import LoadingUI from "../../Components/Loading";
import { ChevronDown, PencilLine, X, ClipboardCopy } from "lucide-react";

const Products = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [allProducts, setAllProducts] = useState([]);
  // const [AllCategories, setAllCategories] = useState([]);
  const { categories, status, error } = useSelector(
    (state) => state.categoryList
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [handlePopup, setHandlePopup] = useState({
    addCategoryPopup: false,
    allCategoryPopup: false,
    allSubCategoryPopup: false,
    addSubCategory: false,
    editSubcategory: false,
    selectedSubcategoryId: null,
    selectedSubcategoryTitle: null,
  });
  const categoryFormRef = useRef(null);
  const subcategoryFormRef = useRef(null);
  const editSubcategoryFormRef = useRef(null);

  const tableHeadersProducts = [
    "Product ID",
    "Vendor ID",
    "Product Name",
    "Category ID",
    "Subcategory ID",
  ];

  const [searchTermProduct, setSearchTermProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  const handleSearchProduct = (e) => {
    const searchValueProduct = e.target.value;
    setSearchTermProduct(searchValueProduct);

    if (searchValueProduct === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts?.filter(
        (product) =>
          product._id.includes(searchValueProduct) ||
          product.vendor.includes(searchValueProduct) ||
          product.name.toLowerCase().includes(searchValueProduct)
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (user?.length > 0) {
        try {
          startLoading();
          const response = await FetchData(
            "products/admin/get-all-products-admin",
            "get"
          );
          // console.log(response);
          if (response.data.success) {
            setAllProducts(response.data.data);
          } else {
            setError("Failed to Products.");
          }
        } catch (err) {
          console.log(err);
          setError(err.response?.data?.message || "Failed to Products");
        } finally {
          stopLoading();
        }
      }
    };

    fetchAllProducts();
  }, [user]);

  const submitCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(categoryFormRef.current);
    // formData.append("image", image);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      startLoading();
      const response = await FetchData(
        "categories/category/add",
        "post",
        formData,
        true
      );
      console.log(response);
      // setAddShowCategoryPopup(false);
      setHandlePopup((prev) => ({
        ...prev,
        addCategoryPopup: false,
      }));
      alert("Your category has been added successfully");
    } catch (err) {
      console.log(err);
    } finally {
      stopLoading();
    }
  };

  // useEffect(() => {
  //   const getAllMainSubcategories = async () => {
  //     try {
  //       startLoading();
  //       const response = await FetchData(
  //         "categories/get-all-category-and-subcategories",
  //         "get"
  //       );
  //       // console.log(response);

  //       // Ensure categories exist before setting state
  //       setAllCategories(response.data?.data?.categories || []);
  //     } catch (error) {
  //       console.log("Error getting all main subcategories", error);
  //     } finally {
  //       stopLoading();
  //     }
  //   };

  //   getAllMainSubcategories();
  // }, []);

  const submitSubCategory = async (e, categoryId) => {
    e.preventDefault();
    const formData = new FormData(subcategoryFormRef.current);
    // formData.append("image");
    // formData.append("category", categoryId); // Attach category ID

    // Debugging: Log form data before sending it
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      startLoading();
      const response = await FetchData(
        "categories/sub-category/add",
        "post",
        formData,
        true
      );
      console.log("Subcategory Added:", response);
      alert("Subcategory Added Successfully!");
      // window.location.reload();

      // setHandlePopup((prev) => ({
      //   ...prev,
      //   addSubCategory: false, // Close popup after submission
      // }));
    } catch (error) {
      console.error("Error adding subcategory:", error);
    } finally {
      stopLoading();
    }
  };

  const handleEditSubcategory = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      startLoading();
      if (!handlePopup.selectedSubcategoryId) {
        alert("Subcategory ID is missing!");
        return;
      }

      const formData = new FormData(editSubcategoryFormRef.current);
      // formData.append("image", image);

      // Log form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await FetchData(
        `categories/edit-sub-category/${handlePopup.selectedSubcategoryId}`,
        "post",
        formData,
        true
      );

      console.log("Response:", response);
      alert("Subcategory Edited Successfully!");
      window.location.reload(); // Refresh page to reflect changes

      // Close popup and reset state
      setHandlePopup({
        editSubcategory: false,
        selectedSubcategoryId: null,
      });
    } catch (error) {
      console.error("Error editing subcategory:", error);
      alert("Failed to edit subcategory.");
    } finally {
      stopLoading();
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <InputBox
        Type="test"
        Value={searchTermProduct}
        onChange={handleSearchProduct}
        Placeholder={"Search by Product Name, Product ID, Vendor ID"}
      />
      <div className="overflow-x-auto">
        <div className="py-4 flex w-full justify-start items-center gap-5">
          <Button
            label={"Add Category"}
            onClick={() =>
              setHandlePopup((prev) => {
                return { ...prev, addCategoryPopup: true };
              })
            }
          />
          <Button
            label={"Show all available categories or subcategories"}
            onClick={() =>
              setHandlePopup((prev) => {
                return { ...prev, allCategoryPopup: true };
              })
            }
          />
        </div>
        {handlePopup.addCategoryPopup && (
          <div className="backdrop-blur-xl absolute top-0 w-full h-full flex justify-center items-center flex-col left-0">
            <div className="bg-white shadow-2xl rounded-xl w-fit h-fit px-10 py-10 flex justify-center items-center">
              <form
                ref={categoryFormRef}
                onSubmit={submitCategory}
                // onSubmit={(e) => {
                //   e.preventDefault();
                //   submitCategory;
                // }}
                className="flex flex-col gap-2 "
              >
                <h1>Add Main & Sub category</h1>
                <InputBox
                  LabelName={"Category"}
                  Placeholder={"Add Category"}
                  Name={"category"}
                  Required
                />
                <InputBox
                  LabelName={"Sub Category"}
                  Placeholder={"Add Sub Category"}
                  Name={"subcategory"}
                  Required
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    // onChange={(e) =>
                    //   setImage(e.target.files[0])
                    // }
                  />
                </div>
                <Button label={"Confirm"} type={"submit"} />
                <Button
                  label={"Cancel"}
                  onClick={() =>
                    setHandlePopup((prev) => {
                      return { ...prev, addCategoryPopup: false };
                    })
                  }
                  className={"hover:bg-red-500"}
                />
              </form>
            </div>
          </div>
        )}
        {handlePopup.allCategoryPopup && (
          <div className="backdrop-blur-3xl absolute top-0 h-screen w-full left-0 px-10 py-5 overflow-scroll">
            <Button
              label={<X />}
              onClick={() =>
                setHandlePopup((prev) => {
                  return { ...prev, allCategoryPopup: false };
                })
              }
            />
            {status === "succeeded" &&
              categories.map((category) => (
                <div key={category._id} className="p-4 rounded ">
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl ">
                    <div>
                      <h2 className="text-sm font-semibold">
                        Main category:{" "}
                        <span className="text-xl">{category.title}</span>
                      </h2>
                      <p className="text-gray-600">
                        Category ID: {category._id}
                      </p>
                    </div>

                    {/* Toggle Dropdown Button */}
                    <Button
                      label={<ChevronDown />}
                      onClick={() =>
                        setHandlePopup((prev) => ({
                          ...prev,
                          [category._id]: !prev[category._id],
                        }))
                      }
                    />
                  </div>

                  {/* Dropdown for Subcategories */}
                  {handlePopup[category._id] && (
                    <div className="mt-3 bg-white p-4 rounded-xl">
                      {/* Add Subcategory Button */}
                      <Button
                        label={<h1>Add more in {category.title}</h1>}
                        onClick={() => {
                          setSelectedCategoryId(category._id); //current category ID
                          setHandlePopup((prev) => ({
                            ...prev,
                            addSubCategory: true,
                          }));
                        }}
                      />

                      {/* Form Popup */}
                      {handlePopup.addSubCategory &&
                        selectedCategoryId === category._id && (
                          <div className="h-full w-full bg-opacity-90 bg-neutral-300 absolute top-0 left-0 flex justify-center items-center">
                            <form
                              ref={subcategoryFormRef}
                              className="flex flex-col justify-center px-10 rounded-xl gap-2 bg-white py-10"
                              onSubmit={(e) => {
                                e.preventDefault();
                                submitSubCategory(e, category._id);
                              }}
                            >
                              <h2 className="text-sm font-semibold">
                                Main category:{" "}
                                <span className="text-xl">
                                  {category.title}
                                </span>
                              </h2>

                              <InputBox
                                LabelName={"Add Sub Category"}
                                Placeholder={"Sub category"}
                                Name={"subcategory"}
                                Required
                              />
                              <InputBox
                                LabelName={
                                  <h1>
                                    Paste the main category ID below{" "}
                                    <span className="text-blue-600 font-semibold">
                                      {category._id}
                                    </span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          category._id
                                        );
                                        alert("Category ID copied!");
                                      }}
                                      className="ml-2 p-1 border rounded bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                      <ClipboardCopy size={16} />
                                    </button>
                                  </h1>
                                }
                                Placeholder={"Paste the above ID"}
                                Name={"categoryId"}
                                Required
                              />
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Upload Image
                                </label>
                                <input
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                  onChange={(e) =>
                                    console.log(e.target.files[0])
                                  }
                                />
                              </div>

                              <Button label={"Add"} type="submit" />
                              <Button
                                className={"hover:bg-red-500"}
                                label={"Cancel"}
                                onClick={() =>
                                  setHandlePopup((prev) => ({
                                    ...prev,
                                    addSubCategory: false,
                                  }))
                                }
                              />
                            </form>
                          </div>
                        )}

                      {/* Display Subcategories */}
                      {category.subcategories.length > 0 ? (
                        <>
                          <h3 className="font-medium">Subcategories:</h3>
                          <ul className="list-disc pl-5">
                            {category.subcategories.map((sub) => (
                              <div className="flex justify-start items-center">
                                <li key={sub._id} className="text-gray-700">
                                  {sub.title} (ID: {sub._id})
                                </li>

                                <button
                                  onClick={() =>
                                    setHandlePopup((prev) => ({
                                      ...prev,
                                      editSubcategory: true,
                                      selectedSubcategoryId: sub._id,
                                      selectedSubcategoryTitle: sub.title,
                                    }))
                                  }
                                >
                                  <PencilLine className="font-thin h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </ul>
                          {handlePopup.editSubcategory && (
                            <div className="absolute top-0 left-0 h-full w-full p-20 bg-white shadow-lg rounded-md">
                              {/* Close Button */}

                              {/* Edit Form */}
                              <form
                                ref={editSubcategoryFormRef}
                                onSubmit={handleEditSubcategory}
                              >
                                {/* Display Selected Subcategory ID */}
                                <p className="text-gray-700 font-medium">
                                  Editing Subcategory Name:{" "}
                                  {handlePopup.selectedSubcategoryTitle}
                                  <span className="mx-5">
                                    Editing Subcategory ID:
                                    {handlePopup.selectedSubcategoryId}
                                  </span>
                                </p>

                                {/* Input for Subcategory Title */}
                                <InputBox
                                  Placeholder={"Enter new Subcategory name"}
                                  LabelName="Edit Subcategory"
                                  Name="newTitle"
                                  Required
                                />

                                {/* Input for Image Upload */}
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Upload Image
                                  </label>
                                  <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                  />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-start my-10 items-center w-full gap-20">
                                  <Button label={"Update"} type={"submit"} />
                                  <Button
                                    label={"Cancel"}
                                    className={"hover:bg-red-500"}
                                    onClick={() =>
                                      setHandlePopup((prev) => ({
                                        ...prev,
                                        editSubcategory: false,
                                        selectedSubcategoryId: null,
                                        selectedSubcategoryTitle: null,
                                      }))
                                    }
                                  />
                                </div>
                              </form>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">
                          No subcategories available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
        <table className="min-w-full border-collapse border border-gray-300 rounded-xl ">
          <thead>
            <tr>
              {tableHeadersProducts.map((header, index) => (
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
            {/* {console.log(filteredProducts)} */}
            {filteredProducts?.length > 0 ? (
              filteredProducts?.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-500 px-4 py-2">
                    <Link
                      className="hover:text-blue-500 underline-blue-500 hover:underline "
                      to={`/current-product/${product._id}`}
                    >
                      {product._id}
                    </Link>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {product.vendor}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 w-96 overflow-hidden  ">
                    {product.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {product.category}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {product.subcategory}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadersProducts.length}
                  className="text-center py-4"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LoadingUI(Products);
