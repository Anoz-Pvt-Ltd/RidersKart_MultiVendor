import React, { useEffect, useRef, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import SelectBox from "../../components/SelectionBox";
// import { categories } from "../../constants/AllProducts.Vendor";

const Products = () => {
  const user = useSelector((store) => store.UserInfo.user);

  const [images, setImages] = useState(null);
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const [products, setProducts] = useState([]);
  console.log(products);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024;

    if (!validImageTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF, WebP, SVG).");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 1MB.");
      e.target.value = "";
      return;
    }
    setImages(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleImageCancel = () => {
    setImages(null);
    setImagePreview(null);
    document.getElementById("imageInput").value = "";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await FetchData(
          `products/get-all-product-of-vendor/${user?.[0]?._id}`,
          "get"
        );
        console.log(response);
        if (response.data.success) setProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);
    console.log(images);
    // formData.append("image", images);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const response = await FetchData(
        `products/register-product/${user?.[0]?._id}`,
        "post",
        formData,
        true
      );
      console.log(response);
      setSuccess("Product added successfully!");
      setProducts((prev) => [...prev, response.data.product]);
      alert("Product added successfully!");
      window.location.reload();

      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add the product.");
    }
  };

  const handleDeleteProduct = async (_id) => {
    setError("");
    setSuccess("");

    try {
      const response = await FetchData(
        `products/delete-products/${_id}`,
        "delete"
      );
      if (response.data.success) {
        setSuccess("Product deleted successfully!");
        setProducts((prev) => prev.filter((product) => product._id !== _id));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete the product.");
    }
  };

  useEffect(() => {
    const getAllMainSubcategories = async () => {
      try {
        const response = await FetchData(
          "main-sub-category/get-all-main-sub-categories",
          "get"
        );
        // console.log(response);

        // Ensure categories exist before setting state
        const categories = response.data?.data?.categories || [];
        setCategories(categories);

        // Extract all subcategories from each category
        const allSubcategories = categories.flatMap(
          (category) => category.subcategories || []
        );
        setSubcategories(allSubcategories);
      } catch (error) {
        console.log("Error getting all main subcategories", error);
      }
    };

    getAllMainSubcategories();
  }, []);

  return (
    <div className="lg:max-w-6xl lg:mx-auto lg:p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-6 mx-4">
        Your Products
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <Button
        label="Add New Product"
        Type="button"
        className="mb-6 mx-4"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 h-screen w-screen overflow-auto">
          <div className="bg-white flex flex-col rounded-lg shadow-lg w-full h-fit mt-96 lg:mt-0 overflow-auto">
            <h2 className="text-lg font-semibold text-gray-800 lg:mb-4 pl-5">
              Add New Product
            </h2>
            <form
              ref={formRef}
              onSubmit={handleAddProduct}
              className="flex flex-col lg:flex-row overscroll-scroll w-full justify-evenly items-center"
            >
              <div className="flex flex-col justify-start items-center">
                <InputBox
                  LabelName="Product Name"
                  Name="name"
                  Placeholder="Enter product name"
                />
                <InputBox
                  LabelName="Description"
                  Name="description"
                  Placeholder="Enter product description"
                />
                <SelectBox
                  LabelName="Main Category"
                  Name="category"
                  Placeholder="Select main category"
                  Options={categories?.map((cat) => ({
                    label: cat.title,
                    value: cat._id, // Correctly linking ID for selection
                  }))}
                />

                {subcategories.length > 0 && (
                  <SelectBox
                    LabelName="Subcategory"
                    Name="subcategory"
                    Placeholder="Select subcategory"
                    Options={subcategories.map((sub) => ({
                      label: sub.title,
                      value: sub._id, // Ensure unique key
                    }))}
                  />
                )}
              </div>
              <div className="flex flex-col justify-start items-center">
                <InputBox
                  LabelName="Price"
                  Type="number"
                  Name="price"
                  Placeholder="Enter price"
                />
                <InputBox
                  LabelName="Stock Quantity"
                  Type="number"
                  Name="stockQuantity"
                  Placeholder="Enter stock quantity"
                />
                <InputBox LabelName="SKU" Name="sku" Placeholder="Enter SKU" />
              </div>
              <div>
                <h3>Images</h3>
                {/* {newProduct.images.map((image, index) => (
                  <div key={index} className="flex flex-col gap-2 sm:flex-row">
                    <InputBox
                      LabelName="Upload Image"
                      Name={`images.${index}.url`}
                      Value={image.url}
                      Placeholder="Enter image URL"
                      onChange={handleInputChange}
                    />
                    <InputBox
                      LabelName="Alt Text"
                      Name={`images.${index}.altText`}
                      Value={image.altText}
                      Placeholder="Enter image alt text"
                      onChange={handleInputChange}
                    />
                  </div>
                ))} */}
                <InputBox
                  LabelName="Upload Image"
                  Type="file"
                  Name={`image`}
                  Placeholder="Enter image URL"
                  onChange={(e) => {
                    handleImageFileChange(e);
                  }}
                />
                {imagePreview && (
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md border"
                    />

                    {/* Cancel Button */}
                    <button
                      onClick={handleImageCancel}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {/* <Button
                  label="Add Image"
                  Type="button"
                  onClick={() =>
                    setNewProduct((prev) => ({
                      ...prev,
                      images: [...prev.images, { url: "", altText: "" }],
                    }))
                  }
                  className="mt-2"
                /> */}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  label="Cancel"
                  Type="button"
                  className="bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button label="Add Product" Type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-4 mx-4">
        Product List
      </h2>
      {products.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product?._id}
              className="mx-2 p-4 border rounded-lg shadow-md bg-gray-100"
            >
              <h3 className="font-bold text-gray-900 flex items-center justify-start gap-10 ">
                {product?.name}{" "}
                <span className="bg-white p-1 rounded-xl shadow">
                  <img
                    src={product?.images[0]?.url}
                    className="w-20 h-20 rounded-xl shadow"
                  />
                </span>
              </h3>
              <p>{product?.description}</p>
              <p>
                <strong>Category:</strong> {product?.category.title} -{" "}
                {product?.subcategory.title}
              </p>
              <p>
                <strong>Price:</strong> ₹ {product?.price}
              </p>
              <p>
                <strong>Stock:</strong> {product?.stockQuantity}
              </p>
              <Button
                label="Delete"
                Type="button"
                className="mt-2 w-full hover:bg-red-500"
                onClick={() => handleDeleteProduct(product?._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
