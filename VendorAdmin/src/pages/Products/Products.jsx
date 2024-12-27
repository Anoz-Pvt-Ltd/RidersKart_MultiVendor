import React, { useEffect, useRef, useState } from "react";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import SelectBox from "../../components/SelectionBox";
import { categories } from "../../constants/AllProducts.Vendor";

const Products = () => {
  const user = useSelector((store) => store.UserInfo.user);
  console.log(user);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: { main: "", sub: "" },
    price: "",
    stockQuantity: "",
    sku: "",
    images: [{ url: "", altText: "" }],
  });
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategories, setSubcategories] = useState([]);

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      if (response.data.success) setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("images")) {
      const [_, index, field] = name.split(".");
      const updatedImages = [...newProduct.images];
      updatedImages[parseInt(index)][field] = value;
      setNewProduct({ ...newProduct, images: updatedImages });
    } else if (name === "category.main") {
      setNewProduct({ ...newProduct, category: { main: value, sub: "" } });
      const selectedCategory = categories.find((cat) => cat.title === value);
      setSubcategories(selectedCategory ? selectedCategory.items : []);
    } else if (name === "category.sub") {
      setNewProduct({
        ...newProduct,
        category: { ...newProduct.category, sub: value },
      });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log(newProduct);
    console.log(user);
    console.log(user?.[0]?._id);

    try {
      const response = await FetchData(
        `products/register-product/${user?.[0]?._id}`,
        "post",
        newProduct
      );
      setSuccess("Product added successfully!");
      setProducts((prev) => [...prev, response.data.product]);

      setNewProduct({
        name: "",
        description: "",
        category: { main: "", sub: "" },
        price: "",
        stockQuantity: "",
        sku: "",
        images: [{ url: "", altText: "" }],
      });
      setIsModalOpen(false);
    } catch (err) {
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Vendor Products
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <Button
        label="Add New Product"
        Type="button"
        className="mb-6"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 sm:p-6">
          <div className="bg-white flex flex-col rounded-lg shadow-lg w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Product
            </h2>
            <form
              onSubmit={handleAddProduct}
              className="flex w-full justify-evenly items-center"
            >
              <div className="flex flex-col justify-start items-center">
                <InputBox
                  LabelName="Product Name"
                  Name="name"
                  Value={newProduct.name}
                  Placeholder="Enter product name"
                  onChange={handleInputChange}
                />
                <InputBox
                  LabelName="Description"
                  Name="description"
                  Value={newProduct.description}
                  Placeholder="Enter product description"
                  onChange={handleInputChange}
                />
                <SelectBox
                  LabelName="Main Category"
                  Name="category.main"
                  Value={newProduct.category.main}
                  Placeholder="Select main category"
                  Options={categories.map((cat) => cat.title)}
                  onChange={handleInputChange}
                />
                {subcategories.length > 0 && (
                  <SelectBox
                    LabelName="Subcategory"
                    Name="category.sub"
                    Value={newProduct.category.sub}
                    Placeholder="Select subcategory"
                    Options={subcategories}
                    onChange={handleInputChange}
                  />
                )}
              </div>
              <div className="flex flex-col justify-start items-center">
                <InputBox
                  LabelName="Price"
                  Type="number"
                  Name="price"
                  Value={newProduct.price}
                  Placeholder="Enter price"
                  onChange={handleInputChange}
                />
                <InputBox
                  LabelName="Stock Quantity"
                  Type="number"
                  Name="stockQuantity"
                  Value={newProduct.stockQuantity}
                  Placeholder="Enter stock quantity"
                  onChange={handleInputChange}
                />
                <InputBox
                  LabelName="SKU"
                  Name="sku"
                  Value={newProduct.sku}
                  Placeholder="Enter SKU"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <h3>Images</h3>
                {newProduct.images.map((image, index) => (
                  <div key={index} className="flex flex-col gap-2 sm:flex-row">
                    <InputBox
                      LabelName="Image URL"
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
                ))}
                <Button
                  label="Add Image"
                  Type="button"
                  onClick={() =>
                    setNewProduct((prev) => ({
                      ...prev,
                      images: [...prev.images, { url: "", altText: "" }],
                    }))
                  }
                  className="mt-2"
                />
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

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Product List</h2>
      {products.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product?._id}
              className="p-4 border rounded-lg shadow-md bg-gray-100"
            >
              <h3 className="font-bold text-gray-900">{product?.name}</h3>
              <p>{product?.description}</p>
              <p>
                <strong>Category:</strong> {product?.category.main} -{" "}
                {product?.category.sub}
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
                className="mt-2 w-full bg-red-500"
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
