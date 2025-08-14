import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import SelectBox from "../../components/SelectionBox";
import LoadingUI from "../../components/Loading";
import TextArea from "../../components/TextWrapper";
import {
  CircleFadingPlus,
  MonitorUp,
  Pencil,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import PopUp from "../../components/PopUpWrapper";
// import { categories } from "../../constants/AllProducts.Vendor";

const Products = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [images, setImages] = useState(null);
  const formRef = useRef(null);
  const mrpRef = useRef(null);
  const discountRef = useRef(null);
  const spRef = useRef(null);
  const mrpUpdRef = useRef(null);
  const discountUpdRef = useRef(null);
  const spUpdRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [popup, setPopup] = useState({
    image: false,
  });
  const [UrlData, setUrlData] = useSearchParams();
  const [editProductData, setEditProductData] = useState(null);
  const editFormRef = useRef(null);

  console.log(products);

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
  const findProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  // Function to calculate and update Selling Price
  const updateSellingPrice = () => {
    const mrp = parseFloat(mrpRef.current?.value) || 0;
    const discount = parseFloat(discountRef.current?.value) || 0;

    if (mrp > 0 && discount >= 0 && discount <= 100) {
      const sellingPrice = mrp - (mrp * discount) / 100;
      spRef.current.value = sellingPrice.toFixed(2); // Update the Selling Price field
    } else {
      spRef.current.value = ""; // Clear if invalid input
    }
  };
  const updateSellingPriceUpdateForm = () => {
    const mrp = parseFloat(mrpUpdRef.current?.value) || 0;
    const discount = parseFloat(discountUpdRef.current?.value) || 0;

    if (mrp > 0 && discount >= 0 && discount <= 100) {
      const sellingPrice = mrp - (mrp * discount) / 100;
      spUpdRef.current.value = sellingPrice.toFixed(2); // Update the Selling Price field
    } else {
      spUpdRef.current.value = ""; // Clear if invalid input
    }
  };

  const fetchProducts = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      console.log(response);
      if (response.data.success) setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(formRef.current);
    // console.log(images);
    // formData.append("image", images);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      startLoading();
      const response = await FetchData(
        `products/register-product/${user?.[0]?._id}`,
        "post",
        formData,
        true
      );
      console.log(response);
      setSuccess("Product added successfully!");
      setProducts((prev) => [...prev, response.data.data.product]);
      alert("Product added successfully!");
      // window.location.reload();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      alert(
        parseErrorMessage(
          err.response?.data || "An error occurred while adding the product."
        )
      );
    } finally {
      stopLoading();
    }
  };

  const handleDeleteProduct = async (_id) => {
    setError("");
    setSuccess("");

    try {
      startLoading();
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
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const getAllMainSubcategories = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "categories/get-all-category-and-subcategories",
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
      } finally {
        stopLoading();
      }
    };

    const GetAllBrands = async () => {
      try {
        startLoading();
        const response = await FetchData("brands/get-all-brands", "get");
        console.log(response);
        if (response.data.success) setBrands(response.data.data);
      } catch {
        setError("Failed to fetch brands.");
      }
    };

    getAllMainSubcategories();
    GetAllBrands();
  }, []);

  const ImageUpdationForm = ({ onClose, imagesRequired }) => {
    const [images, setImages] = useState([]);

    const formRef = useRef(null);
    const productId = UrlData.get("productId");

    const handleAddImages = async (event) => {
      event.preventDefault();

      const formData = new FormData(formRef.current);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      try {
        startLoading();
        const response = await FetchData(
          `products/add-images/${productId}`,
          "patch",
          formData,
          true
        );

        console.log("Image uploaded", response.data);
        alert(response.data.message);
        onClose();
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        stopLoading();
      }
    };

    return (
      <PopUp onClose={onClose}>
        <div className="flex justify-center items-center w-[80vw] place-self-center  ">
          <form
            ref={formRef}
            onSubmit={handleAddImages}
            className="w-full max-h-screen overflow-y-auto lg:overflow-visible lg:max-h-none p-6 lg:p-16 flex flex-col items-center justify-center rounded-2xl bg-white"
          >
            <label
              className="block mb-2 font-medium text-black text-2xl"
              htmlFor="file_input"
            >
              Upload Images
            </label>

            <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 gap-5 justify-center items-center my-10">
              {Array(imagesRequired())
                .fill("")
                .map((_, index) => {
                  return (
                    <div
                      className={`flex items-center justify-center space-x-6 ${
                        index + 1 == imagesRequired() && (index + 1) % 2 !== 0
                          ? "sm:col-span-2"
                          : ""
                      }`}
                      key={index}
                    >
                      <div className="shrink-0 flex justify-center items-center h-16 w-16">
                        {images[index] && (
                          <img
                            id="preview_img"
                            className="object-cover rounded"
                            src={images[index]?.src}
                            alt="uploaded image"
                          />
                        )}
                      </div>
                      <label>
                        <span className="sr-only">Choose photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          name="images"
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 border border-neutral-200 p-2 rounded-full"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImages((prevImages) => [
                                ...prevImages,
                                {
                                  id: Math.random(),
                                  src: reader.result,
                                },
                              ]);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  );
                })}
            </div>

            <Button label="Submit" Type="submit" className="mt-10" />
          </form>
        </div>
      </PopUp>
    );
  };
  const handleProductNameChange = (e) => {
    const rawValue = e.target.value;
    // allow letters, numbers, space, and hyphen
    const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9 \-]/g, "");
    setProductName(sanitizedValue);
  };

  // Open edit modal and set product data
  const handleEditProduct = (product) => {
    setEditProductData({
      ...product,
      name: product.name || "",
      brand: product.brand?._id || product.brand || "",
      category: product.category?._id || product.category || "",
      subcategory: product.subcategory?._id || product.subcategory || "",
      MRP: product.price?.MRP || "",
      discount: product.price?.discount || "",
      SP: product.price?.sellingPrice || "",
      stockQuantity: product.stockQuantity || "",
      sku: product.sku || "",
      description: product.description || "",
      specifications: product.specifications?.details || "",
      tags: Array.isArray(product.tags)
        ? product.tags.join(",")
        : product.tags || "",
    });
    setEditModalOpen(true);
  };

  // Handle changes in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prev) => {
      // If MRP or discount changes, update SP
      let updated = { ...prev, [name]: value };
      if (name === "MRP" || name === "discount") {
        const mrp = name === "MRP" ? value : prev.MRP;
        const discount = name === "discount" ? value : prev.discount;
        const sellingPrice =
          (parseFloat(mrp) || 0) -
          ((parseFloat(mrp) || 0) * (parseFloat(discount) || 0)) / 100;
        updated.SP = sellingPrice > 0 ? sellingPrice.toFixed(2) : "";
      }
      return updated;
    });
  };

  // Handle update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!editProductData) return;

    const payload = {
      id: editProductData._id,
      name: editProductData.name,
      brand: editProductData.brand,
      category: editProductData.category,
      subcategory: editProductData.subcategory,
      price: {
        MRP: editProductData.MRP,
        sellingPrice: editProductData.SP,
        discount: editProductData.discount,
      },
      stockQuantity: editProductData.stockQuantity,
      sku: editProductData.sku,
      description: editProductData.description,
      specifications: { details: editProductData.specifications },
      tags: editProductData.tags.split(",").map((t) => t.trim()),
    };

    try {
      startLoading();
      const response = await FetchData(
        `products/edit-product/${editProductData._id}`,
        "post",
        payload
      );
      setSuccess("Product updated successfully!");
      // Update product in local state
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editProductData._id
            ? { ...p, ...payload, price: payload.price }
            : p
        )
      );
      setEditModalOpen(false);
      alert("Product updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update the product.");
      alert("Product updation failed.");
      console.log(err);
    } finally {
      stopLoading();
    }
  };

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
        <div className="fixed inset-0 flex items-start lg:items-start justify-center  backdrop-blur-xl p-4 h-screen w-screen overflow-auto top-0 left-0  z-50">
          <div className="bg-white flex flex-col rounded-lg shadow-lg w-fit lg:px-20 lg:py-10 py-4">
            <h2 className="text-lg font-semibold text-gray-800 lg:mb-4 w-full text-center">
              Add New Product
            </h2>
            <form
              ref={formRef}
              onSubmit={handleAddProduct}
              className="flex flex-col  w-full justify-evenly items-center"
            >
              <div className="w-full overflow-y-auto max-h-screen p-2 lg:p-0 grid grid-cols-1 lg:grid-cols-3 lg:gap-2 ">
                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Product Name (No special characters)"
                    Name="name"
                    Placeholder="Enter product name"
                    Value={productName}
                    onChange={handleProductNameChange}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <SelectBox
                    className2="w-full"
                    LabelName="Brand"
                    Name="brand"
                    Placeholder="Select main category"
                    Options={brands?.map((brand) => ({
                      label: brand.title,
                      value: brand._id,
                    }))}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <SelectBox
                    className2="w-full"
                    LabelName="Main Category"
                    Name="category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    Placeholder="Select main category"
                    Options={categories?.map((cat) => ({
                      label: cat.title,
                      value: cat._id,
                    }))}
                  />
                </div>

                <div className="flex items-start justify-center">
                  {subcategories.length > 0 && (
                    <SelectBox
                      className2="w-full"
                      LabelName="Subcategory"
                      Name="subcategory"
                      Placeholder="Select subcategory"
                      Options={subcategories
                        .filter(
                          (subs) => subs.category._id === selectedCategory
                        )
                        .map((sub) => ({
                          label: sub.title,
                          value: sub._id,
                        }))}
                    />
                  )}
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="MRP"
                    Type="number"
                    Name="MRP"
                    Placeholder="Enter price"
                    Ref={mrpRef}
                    OnInput={updateSellingPrice}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Discount(%)"
                    Type="number"
                    Name="discount"
                    Placeholder="Enter Discount percentage"
                    Ref={discountRef}
                    OnInput={updateSellingPrice}
                    max={100}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Selling Price (Optional)"
                    Type="number"
                    Name="SP"
                    Value={updateSellingPrice}
                    Placeholder="Enter Discount"
                    Disabled={true}
                    Ref={spRef}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Stock Quantity"
                    Type="number"
                    Name="stockQuantity"
                    Placeholder="Enter stock quantity"
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Stock keeping unit (SKU)"
                    Name="sku"
                    Placeholder="Enter SKU"
                  />
                </div>

                <div className="px-2 row-span-5">
                  <InputBox
                    LabelName="Upload Image"
                    Type="file"
                    Name="image"
                    onChange={handleImageFileChange}
                  />
                  {imagePreview && (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      <button
                        onClick={handleImageCancel}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Description"
                    Name="description"
                    Placeholder="Enter product description"
                    className="max-h-20 min-h-20"
                  />
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Specification"
                    Name="specifications"
                    Placeholder="Enter Specification"
                    className="max-h-20 min-h-20"
                  />
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Tags"
                    Name="tags"
                    Placeholder="Enter Tags"
                    className="max-h-20 min-h-20"
                  />
                </div>
              </div>

              <div className="button flex lg:flex-row flex-col w-full lg:w-fit px-2 justify-end gap-2">
                <Button label="Add Product" Type="submit" />
                <Button
                  label="Cancel"
                  Type="button"
                  className="bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModalOpen && editProductData && (
        <div className="fixed inset-0 flex items-start lg:items-center justify-center  backdrop-blur-xl p-4 h-screen w-screen overflow-auto top-0 left-0  z-50">
          <div className="bg-white flex flex-col rounded-lg shadow-lg w-full  lg:px-20 lg:py-10 py-5">
            <h2 className="text-lg font-semibold text-gray-800 lg:mb-4 w-full text-center">
              Edit Product
            </h2>
            <form
              ref={editFormRef}
              onSubmit={handleUpdateProduct}
              className="flex flex-col  w-full justify-evenly items-center"
            >
              <div className="w-full p-2 lg:p-0 grid grid-cols-1 lg:grid-cols-3 lg:gap-2 lg:max-h-none">
                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Product Name (No special characters)"
                    Name="name"
                    Placeholder="Enter product name"
                    Value={editProductData.name}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <SelectBox
                    className2="w-full"
                    LabelName="Brand"
                    Name="brand"
                    Placeholder="Select main category"
                    Value={editProductData.brand}
                    onChange={handleEditChange}
                    Options={brands?.map((brand) => ({
                      label: brand.title,
                      value: brand._id,
                    }))}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <SelectBox
                    className2="w-full"
                    LabelName="Main Category"
                    Name="category"
                    Value={editProductData.category}
                    onChange={(e) => {
                      handleEditChange(e);
                      setSelectedCategory(e.target.value);
                    }}
                    Placeholder="Select main category"
                    Options={categories?.map((cat) => ({
                      label: cat.title,
                      value: cat._id,
                    }))}
                  />
                </div>

                <div className="flex items-start justify-center">
                  {subcategories.length > 0 && (
                    <SelectBox
                      className2="w-full"
                      LabelName="Subcategory"
                      Name="subcategory"
                      Value={editProductData.subcategory}
                      onChange={handleEditChange}
                      Placeholder="Select subcategory"
                      Options={subcategories
                        .filter(
                          (subs) =>
                            subs.category._id ===
                            (editProductData.category || selectedCategory)
                        )
                        .map((sub) => ({
                          label: sub.title,
                          value: sub._id,
                        }))}
                    />
                  )}
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="MRP"
                    Type="number"
                    Name="MRP"
                    Placeholder="Enter price"
                    Value={editProductData.MRP}
                    onChange={handleEditChange}
                    Ref={mrpUpdRef}
                    OnInput={updateSellingPriceUpdateForm}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Discount(%)"
                    Type="number"
                    Name="discount"
                    Placeholder="Enter Discount percentage"
                    Value={editProductData.discount}
                    onChange={handleEditChange}
                    max={100}
                    Ref={discountUpdRef}
                    OnInput={updateSellingPriceUpdateForm}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Selling Price (Optional)"
                    Type="number"
                    Name="SP"
                    Disabled={true}
                    Placeholder="Enter Discount"
                    Ref={spUpdRef}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Stock Quantity"
                    Type="number"
                    Name="stockQuantity"
                    Placeholder="Enter stock quantity"
                    Value={editProductData.stockQuantity}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Stock keeping unit (SKU)"
                    Name="sku"
                    Placeholder="Enter SKU"
                    Value={editProductData.sku}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Description"
                    Name="description"
                    Placeholder="Enter product description"
                    Value={editProductData.description}
                    onChange={handleEditChange}
                    className="max-h-20 min-h-20"
                  />
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Specification"
                    Name="specifications"
                    Placeholder="Enter Specification"
                    Value={editProductData.specifications}
                    onChange={handleEditChange}
                    className="max-h-20 min-h-20"
                  />
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Tags"
                    Name="tags"
                    Placeholder="Enter Tags"
                    Value={editProductData.tags}
                    onChange={handleEditChange}
                    className="max-h-20 min-h-20"
                  />
                </div>
              </div>

              <div className="button flex lg:flex-row flex-col w-full lg:w-fit px-2 justify-end gap-2">
                <Button
                  label="Cancel"
                  Type="button"
                  className="bg-gray-300"
                  onClick={() => setEditModalOpen(false)}
                />
                <Button label="Update" Type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center gap-5 w-fit ">
        <h2 className="text-lg font-semibold text-gray-800">
          Product List{" "}
          <span className="text-xs font-light">({products.length})</span>
        </h2>
        <button onClick={fetchProducts} className="">
          <RotateCw size={20} color="green" />
        </button>
      </div>
      {products.length === 0 ? (
        <div>No products available.</div>
      ) : (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-gray-700 bg-white  border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product?._id}
                className="mx-2 p-4 border rounded-lg shadow-md bg-gray-100"
              >
                <h3 className="font-bold text-gray-900 flex items-center justify-start gap-10 ">
                  {product?.name}{" "}
                </h3>
                <div className="flex">
                  <span className=" p-1 rounded-xl flex items-center  ">
                    <img
                      src={product?.images[0]?.url}
                      className="min-w-20 h-20 m-1 rounded-xl  shadow"
                    />
                  </span>
                  <div className="flex flex-col items-center justify-evenly px-1">
                    <button
                      onClick={() => {
                        setUrlData({ productId: product?._id });
                        setPopup((prev) => {
                          return { ...prev, image: true };
                        });
                      }}
                      title="Add images"
                    >
                      <CircleFadingPlus /> <span> Add Image</span>
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      title="Edit product"
                      className=" text-black "
                    >
                      <Pencil /> <span>Edit Product</span>
                    </button>
                  </div>
                </div>

                <p className="truncate">{product?.description}</p>
                <p>
                  <strong>Category:</strong> {product?.category?.title} -{" "}
                  {product?.subcategory?.title}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {product?.price?.sellingPrice}
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
          {popup.image && (
            <ImageUpdationForm
              onClose={() =>
                setPopup((prev) => {
                  return { ...prev, image: false };
                })
              }
              imagesRequired={() => {
                const product = findProductById(UrlData.get("productId"));
                return 10 - product?.images?.length;
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingUI(Products);
