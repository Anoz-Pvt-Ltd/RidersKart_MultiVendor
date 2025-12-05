import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FetchData } from "../../utils/FetchFromApi";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import SelectBox from "../../components/SelectionBox";
import LoadingUI from "../../components/Loading";
import TextArea from "../../components/TextWrapper";
import { CircleFadingPlus, Pencil, RotateCw } from "lucide-react";
import PopUp from "../../components/PopUpWrapper";
import { PinCodeData } from "../../constants/PinCodeData";
import { parseErrorMessage } from "../../utils/ErrorMessageParser";
import { Check } from "lucide-react";

const MultiSelect = ({ label, options, selected = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  useEffect(() => {
    // close dropdown on outside click
    const handler = (e) => {
      // simple approach: close if clicked outside any button
      // more robust solution could be added, but this is enough for now
      if (!e.target.closest(".multiselect-root")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="w-full multiselect-root">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left bg-white hover:shadow-md transition"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {selected && selected.length > 0
            ? selected.join(", ")
            : `Select ${label}`}
        </button>

        {isOpen && (
          <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={(ev) => {
                  ev.stopPropagation();
                  toggleOption(opt.value);
                }}
                className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-indigo-100 ${
                  selected.includes(opt.value) ? "bg-indigo-50" : ""
                }`}
              >
                <span>{opt.label}</span>
                {selected.includes(opt.value) && (
                  <Check size={18} className="text-indigo-600" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Products = ({ startLoading, stopLoading }) => {
  const user = useSelector((store) => store.UserInfo.user);
  const [images, setImages] = useState([]); // array of File
  const formRef = useRef(null);
  const mrpRef = useRef(null);
  const discountRef = useRef(null);
  const spRef = useRef(null);
  const mrpUpdRef = useRef(null);
  const discountUpdRef = useRef(null);
  const spUpdRef = useRef(null);
  const editFormRef = useRef(null);
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
  const [UrlData, setUrlData] = useSearchParams();
  const [editProductData, setEditProductData] = useState(null);
  const [deliveryScope, setDeliveryScope] = useState("all");
  const [editDeliveryScope, setEditDeliveryScope] = useState("all");
  const [imagePreviews, setImagePreviews] = useState([]); // preview urls for add modal
  const [popup, setPopup] = useState({ image: false });

  // states for multi-select in add modal
  const [deliveryStates, setDeliveryStates] = useState([]);
  const [deliveryCities, setDeliveryCities] = useState([]);

  useEffect(() => {
    if (!isModalOpen && formRef.current) {
      formRef.current.reset();
      setProductName("");
      setImagePreview(null);
      setImages([]);
      setImagePreviews([]);
      setDeliveryScope("all");
      setDeliveryStates([]);
      setDeliveryCities([]);
    }
  }, [isModalOpen]);

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ensure images state stays as array (empty array means none)
  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    // Enforce max 5 images total
    const existingCount = images.length;
    if (existingCount + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    // Filter valid image types and sizes
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const maxSize = 1 * 1024 * 1024;

    const acceptedFiles = [];
    const previewUrls = [];

    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type.`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} must be less than 1MB.`);
        continue;
      }
      acceptedFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...acceptedFiles]);
    setImagePreviews((prev) => [...prev, ...previewUrls]);

    // reset input element value so same file can be selected again if needed
    if (e.target) e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // // Keep single-file helpers but ensure images state remains consistent
  // const handleImageFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const validImageTypes = [
  //     "image/jpeg",
  //     "image/png",
  //     "image/gif",
  //     "image/webp",
  //     "image/svg+xml",
  //   ];
  //   const maxSize = 1 * 1024 * 1024;

  //   if (!validImageTypes.includes(file.type)) {
  //     alert("Please upload a valid image file (JPG, PNG, GIF, WebP, SVG).");
  //     e.target.value = "";
  //     return;
  //   }

  //   if (file.size > maxSize) {
  //     alert("File size must be less than 1MB.");
  //     e.target.value = "";
  //     return;
  //   }

  //   // if this was intended to be a single file field, we place it as single image in array
  //   setImages([file]);
  //   setImagePreviews([URL.createObjectURL(file)]);
  // };

  // const handleImageCancel = () => {
  //   setImages([]);
  //   setImagePreviews([]);
  //   const el = document.getElementById("imageInput");
  //   if (el) el.value = "";
  // };

  const findProductById = (id) => {
    return products.find((product) => product._id === id);
  };

  // Selling price auto-calculation for Add form
  const updateSellingPrice = () => {
    const mrp = parseFloat(mrpRef.current?.value) || 0;
    const discount = parseFloat(discountRef.current?.value) || 0;

    if (mrp > 0 && discount >= 0 && discount <= 100) {
      const sellingPrice = mrp - (mrp * discount) / 100;
      if (spRef.current) spRef.current.value = Math.round(sellingPrice);
    } else {
      if (spRef.current) spRef.current.value = "";
    }
  };

  // Selling price auto-calculation for Update form
  const updateSellingPriceUpdateForm = () => {
    const mrp = parseFloat(mrpUpdRef.current?.value) || 0;
    const discount = parseFloat(discountUpdRef.current?.value) || 0;

    if (mrp > 0 && discount >= 0 && discount <= 100) {
      const sellingPrice = mrp - (mrp * discount) / 100;
      if (spUpdRef.current) spUpdRef.current.value = Math.round(sellingPrice);
    } else {
      if (spUpdRef.current) spUpdRef.current.value = "";
    }
  };

  const fetchProducts = async () => {
    try {
      startLoading();
      const response = await FetchData(
        `products/get-all-product-of-vendor/${user?.[0]?._id}`,
        "get"
      );
      setProducts(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (user) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Add product handler (multipart/form-data)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formRef.current) return;

    // Build FormData
    const formData = new FormData(formRef.current);

    // Append images (array)
    images.forEach((img) => {
      formData.append("images", img);
    });

    // Append delivery scope and arrays
    formData.set("deliveryScope", deliveryScope || "all");
    if (deliveryScope === "state") {
      deliveryStates.forEach((s) => formData.append("deliveryStates[]", s));
    }
    if (deliveryScope === "city") {
      deliveryCities.forEach((c) => formData.append("deliveryCities[]", c));
    }

    // Parse specifications Option A ("key: value" per line)
    const rawSpecs = formRef.current.elements["specifications"]?.value || "";
    const specsObj = {};
    rawSpecs.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const parts = trimmed.split(":");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(":").trim();
        if (key) specsObj[key] = value;
      }
    });
    // Append specifications as JSON string (backend should accept JSON string in multipart)
    formData.set("specifications", JSON.stringify(specsObj));

    try {
      startLoading();

      const response = await FetchData(
        `products/register-product/${user?.[0]?._id}`,
        "post",
        formData,
        true // send multipart header
      );

      setSuccess("Product added successfully!");
      // add new product to local list if returned
      if (response?.data?.data?.product) {
        setProducts((prev) => [...prev, response.data.data.product]);
      }
      alert("Product added successfully!");

      // Reset the UI
      setProductName("");
      setImages([]);
      setImagePreviews([]);
      formRef.current.reset();
      setIsModalOpen(false);
    } catch (err) {
      alert(parseErrorMessage(err?.response?.data));
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
        const categories = response.data?.data?.categories || [];
        setCategories(categories);
        const allSubcategories = categories.flatMap(
          (category) => category.subcategories || []
        );
        setSubcategories(allSubcategories);
      } catch (error) {
        // ignore for now
      } finally {
        stopLoading();
      }
    };

    const GetAllBrands = async () => {
      try {
        startLoading();
        const response = await FetchData("brands/get-all-brands", "get");
        if (response.data.success) setBrands(response.data.data);
      } catch {
        setError("Failed to fetch brands.");
      }
    };

    getAllMainSubcategories();
    GetAllBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ImageUpdationForm - for adding images to existing product
  const ImageUpdationForm = ({ onClose, imagesRequired }) => {
    const [localImages, setLocalImages] = useState([]);
    const formLocalRef = useRef(null);
    const maxToUpload = imagesRequired();

    const handleAddImages = async (event) => {
      event.preventDefault();

      const formData = new FormData(formLocalRef.current);

      // validate we are not exceeding allowed images
      if (localImages.length > maxToUpload) {
        alert(`You can only upload ${maxToUpload} more images.`);
        return;
      }

      try {
        startLoading();
        const productId = UrlData.get("productId");
        const response = await FetchData(
          `products/add-images/${productId}`,
          "patch",
          formData,
          true
        );

        alert(response.data.message);
        onClose();
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images.");
      } finally {
        stopLoading();
      }
    };

    return (
      <PopUp onClose={onClose}>
        <div className="flex justify-center items-center w-[80vw] place-self-center  ">
          <form
            ref={formLocalRef}
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
              {Array.from({ length: maxToUpload }).map((_, index) => {
                return (
                  <div
                    className={`flex items-center justify-center space-x-6 ${
                      index + 1 == maxToUpload && (index + 1) % 2 !== 0
                        ? "sm:col-span-2"
                        : ""
                    }`}
                    key={index}
                  >
                    <div className="shrink-0 flex justify-center items-center h-16 w-16">
                      {/* No preview per-field here to keep markup simple */}
                    </div>
                    <label>
                      <span className="sr-only">Choose photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        name="images"
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 border border-neutral-200 p-2 rounded-full"
                        onChange={(ev) => {
                          const file = ev.target.files[0];
                          if (!file) return;
                          // validate size/type
                          const validTypes = [
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                            "image/svg+xml",
                          ];
                          if (!validTypes.includes(file.type)) {
                            alert("Invalid file type.");
                            ev.target.value = "";
                            return;
                          }
                          if (file.size > 1 * 1024 * 1024) {
                            alert("Max 1MB per file.");
                            ev.target.value = "";
                            return;
                          }
                          setLocalImages((prev) => {
                            const newArr = [...prev];
                            newArr[index] = file;
                            return newArr;
                          });
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

  // Keep product name sanitized
  const handleProductNameChange = (e) => {
    const rawValue = e.target.value;
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
      productDimensions: product.productDimensions || "",
      productWeight: product.productWeight || "",
      description: product.description || "",
      specifications:
        typeof product.specifications === "object" &&
        product.specifications !== null
          ? // convert map/object to Option A string for UI
            Object.entries(product.specifications)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")
          : product.specifications || "",
      tags: Array.isArray(product.tags)
        ? product.tags.join(",")
        : product.tags || "",
      deliveryStates: product.deliveryStates || [],
      deliveryCities: product.deliveryCities || [],
      productPolicy: {
        policyDescription: product?.productPolicy?.policyDescription || "",
      },
    });
    setEditDeliveryScope(product.deliveryScope || "all");
    setEditModalOpen(true);
    // ensure SP update value is set once modal opens
    setTimeout(() => {
      if (spUpdRef.current)
        spUpdRef.current.value = product.price?.sellingPrice || "";
    }, 50);
  };

  // Handle changes in edit form (input elements pass name/value)
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditProductData((prev) => {
      // special case for nested policyDescription
      if (name === "policyDescription") {
        return {
          ...prev,
          productPolicy: {
            ...prev.productPolicy,
            policyDescription: value,
          },
        };
      }

      let updated = { ...prev, [name]: value };

      if (name === "MRP" || name === "discount") {
        const mrp = name === "MRP" ? value : prev.MRP;
        const discount = name === "discount" ? value : prev.discount;

        const sellingPrice =
          (parseFloat(mrp) || 0) -
          ((parseFloat(mrp) || 0) * (parseFloat(discount) || 0)) / 100;

        updated.SP = Math.round(sellingPrice);
        setTimeout(() => {
          if (spUpdRef.current)
            spUpdRef.current.value = Math.round(sellingPrice);
        }, 0);
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

    // parse specifications (Option A) into object/map
    const specsRaw = editProductData.specifications || "";
    const specsObj = {};
    specsRaw.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const parts = trimmed.split(":");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(":").trim();
        if (key) specsObj[key] = value;
      }
    });

    const payload = {
      id: editProductData._id,
      name: editProductData.name,
      brand: editProductData.brand,
      category: editProductData.category,
      subcategory: editProductData.subcategory,
      price: {
        MRP: Number(editProductData.MRP) || 0,
        sellingPrice: Number(editProductData.SP) || 0,
        discount: Number(editProductData.discount) || 0,
      },
      stockQuantity: Number(editProductData.stockQuantity) || 0,
      sku: editProductData.sku,
      productDimensions: editProductData.productDimensions,
      productWeight: editProductData.productWeight,
      description: editProductData.description,
      specifications: specsObj,
      tags: (editProductData.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      deliveryScope: editDeliveryScope,
      deliveryStates: editProductData.deliveryStates || [],
      deliveryCities: editProductData.deliveryCities || [],
      productPolicy: {
        policyDescription:
          editProductData.productPolicy.policyDescription || "",
      },
    };

    try {
      startLoading();
      const response = await FetchData(
        `products/edit-product/${editProductData._id}`,
        "post",
        payload
      );
      setSuccess("Product updated successfully!");
      // Update product in local state (merge returned fields)
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
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="lg:max-w-6xl lg:mx-auto lg:p-4 lg:bg-white lg:shadow-lg rounded-lg">
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
        <div className="fixed inset-0 flex items-start lg:items-start justify-center  bg-black/70 p-4 h-screen w-screen overflow-auto top-0 left-0  z-40">
          <div className="bg-white flex flex-col rounded-lg shadow-lg w-full lg:px-20 lg:py-10 py-4">
            <h2 className="text-lg font-semibold text-gray-800 lg:mb-4 w-full text-center">
              Add New Product
            </h2>
            <form
              ref={formRef}
              onSubmit={handleAddProduct}
              className="flex flex-col  w-full justify-evenly items-center"
            >
              <div className="w-full  p-2 lg:p-0 flex flex-col justify-start items-start">
                <InputBox
                  LabelName="Product Name (No special characters)"
                  Name="name"
                  Placeholder="Enter product name"
                  Value={productName}
                  onChange={handleProductNameChange}
                />
                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-0 md:gap-5">
                  <SelectBox
                    className2="w-full"
                    LabelName="Brand"
                    Name="brand"
                    Placeholder="Select Brand"
                    Options={brands?.map((brand) => ({
                      label: brand.title,
                      value: brand._id,
                    }))}
                  />
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
                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-0 md:gap-5">
                  <InputBox
                    LabelName="MRP"
                    Type="number"
                    Name="MRP"
                    Placeholder="Enter price"
                    Ref={mrpRef}
                    OnInput={updateSellingPrice}
                  />
                  <InputBox
                    LabelName="Discount(%)"
                    Type="number"
                    Name="discount"
                    Placeholder="Enter Discount percentage"
                    Ref={discountRef}
                    OnInput={updateSellingPrice}
                    max={100}
                  />
                  <InputBox
                    LabelName="Selling Price (Optional)"
                    Type="number"
                    Name="SP"
                    Placeholder="Auto-calculated"
                    Disabled={true}
                    Ref={spRef}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-0 md:gap-5">
                  <InputBox
                    LabelName="Stock keeping unit (SKU)"
                    Name="sku"
                    Placeholder="Enter SKU"
                  />
                  <InputBox
                    LabelName="Stock Quantity"
                    Type="number"
                    Name="stockQuantity"
                    Placeholder="Enter stock quantity"
                  />
                </div>

                <div className="flex items-start justify-center w-full">
                  <TextArea
                    LabelName="Description"
                    Name="description"
                    Placeholder="Enter product description"
                    className="max-h-20 min-h-20"
                  />
                </div>

                <div className="flex items-start justify-center w-full">
                  <TextArea
                    LabelName="Specification"
                    Name="specifications"
                    Placeholder={
                      "Enter specifications in format:\ncolor: red\nsize: large"
                    }
                    className="max-h-24 min-h-24"
                  />
                </div>

                <div className="flex items-start justify-center w-full">
                  <TextArea
                    LabelName="Tags"
                    Name="tags"
                    Placeholder="Enter Tags"
                    className="max-h-20 min-h-20"
                  />
                </div>

                {/* Product Dimensions */}
                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-0 md:gap-5">
                  <InputBox
                    LabelName="Product Dimensions"
                    Name="productDimensions"
                    Placeholder="e.g. 10 x 5 x 3 cm"
                  />
                  <InputBox
                    LabelName="Product Weight"
                    Name="productWeight"
                    Placeholder="e.g. 250 g"
                  />
                  <SelectBox
                    className2="w-full"
                    LabelName="Delivery Scope"
                    Name="deliveryScope"
                    Options={[
                      { label: "All India", value: "all" },
                      { label: "State Selection", value: "state" },
                      { label: "City Selection", value: "city" },
                    ]}
                    onChange={(e) => {
                      setDeliveryScope(e.target.value);
                      // reset selections when changing scope
                      if (e.target.value !== "state") setDeliveryStates([]);
                      if (e.target.value !== "city") setDeliveryCities([]);
                    }}
                  />
                </div>
                <div className="flex justify-center items-center w-full">
                  {/* State Multi-Select */}
                  {deliveryScope === "state" && (
                    <div className="flex items-start justify-center col-span-2">
                      <MultiSelect
                        label="Select States"
                        options={Object.keys(PinCodeData).map((state) => ({
                          label: state,
                          value: state,
                        }))}
                        selected={deliveryStates}
                        onChange={(values) => setDeliveryStates(values)}
                      />
                    </div>
                  )}

                  {/* City Multi-Select */}
                  {deliveryScope === "city" && (
                    <div className="flex items-start justify-center col-span-2">
                      <MultiSelect
                        label="Select Cities"
                        options={Object.entries(PinCodeData).flatMap(
                          ([state, cities]) =>
                            Object.keys(cities).map((city) => ({
                              label: `${city} (${state})`,
                              value: city,
                            }))
                        )}
                        selected={deliveryCities}
                        onChange={(values) => setDeliveryCities(values)}
                      />
                    </div>
                  )}
                </div>
                {/* policy section  */}
                <div className="flex flex-col justify-center items-center w-full bg-neutral-200 p-2 rounded-xl my-5">
                  <h1 className="uppercase tracking-widest">Product Policy</h1>
                  {/* <InputBox
                    LabelName="Policy name (e.g. Return Policy)"
                    Name="policyName"
                    Placeholder="Enter policy name"
                    Value={productName}
                    onChange={handleProductNameChange}
                    Required={false}
                  />
                  <TextArea
                    LabelName="Terms and Conditions"
                    Name="policyTermsAndConditions"
                    Placeholder="Enter product Terms and Conditions"
                    className="max-h-20 min-h-20"
                    Required={false}
                  />
                  <TextArea
                    LabelName="policy Summary"
                    Name="policySummary"
                    Placeholder="Enter product policy Summary"
                    className="max-h-20 min-h-20"
                    Required={false}
                  /> */}
                  <TextArea
                    LabelName="Policy Description"
                    Name="policyDescription"
                    Placeholder="Enter product's policy description"
                    className="max-h-20 min-h-20"
                    Required={false}
                  />
                  {/* <div className="flex w-full justify-center items-center gap-5 flex-col md:flex-row">
                    <InputBox
                      LabelName={"Valid from"}
                      Type="date"
                      Name={"policyValidFrom"}
                      Required={false}
                    />
                    <InputBox
                      LabelName={"Valid till"}
                      Type="date"
                      Name={"policyValidTill"}
                      Required={false}
                    />
                  </div> */}
                </div>
              </div>
              {/* image section  */}
              <div className="px-2 py-10">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images{" "}
                  <span className="text-xs text-red-600 ">
                    (*Upload max 5 images here)
                  </span>
                </label>

                {/* Native File Input (multiple) */}
                <input
                  id="imageInput"
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImageChange}
                  className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-500 focus:outline-none p-5 text-white"
                />

                {/* Preview Grid */}
                {imagePreviews.length > 0 && (
                  <div>
                    <h3>Selected images are below: </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {imagePreviews.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            className="w-full h-32 object-cover rounded-md"
                            alt={`preview-${index}`}
                          />

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="button flex lg:flex-row flex-col w-full lg:w-fit px-2 justify-end gap-2">
                <Button label="Add Product" Type="submit" />
                <Button
                  label="Cancel"
                  Type={"reset"}
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
        <div className="fixed inset-0 flex items-start lg:items-center justify-center  backdrop-blur-xl p-4 h-screen w-screen overflow-auto top-0 left-0  z-40">
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
                    Placeholder="Select Brand"
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
                    Placeholder="Auto-calculated"
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
                    Placeholder={
                      "Enter specifications in format:\ncolor: red\nsize: large"
                    }
                    Value={editProductData.specifications}
                    onChange={(e) =>
                      setEditProductData((prev) => ({
                        ...prev,
                        specifications: e.target.value,
                      }))
                    }
                    className="max-h-20 min-h-20"
                  />
                </div>

                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Tags"
                    Name="tags"
                    Placeholder="Enter Tags"
                    Value={editProductData.tags}
                    onChange={(e) =>
                      setEditProductData((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    className="max-h-20 min-h-20"
                  />
                </div>

                {/* Product Dimensions */}
                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Product Dimensions"
                    Name="productDimensions"
                    Placeholder="e.g. 10 x 5 x 3 cm"
                    Value={editProductData.productDimensions}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Product Weight */}
                <div className="flex items-start justify-center">
                  <InputBox
                    LabelName="Product Weight"
                    Name="productWeight"
                    Placeholder="e.g. 250 g"
                    Value={editProductData.productWeight}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Delivery Scope Selection */}
                <div className="flex items-start justify-center">
                  <SelectBox
                    className2="w-full"
                    LabelName="Delivery Scope"
                    Name="deliveryScope"
                    Value={editDeliveryScope}
                    onChange={(e) => {
                      setEditDeliveryScope(e.target.value);
                      if (e.target.value !== "state") {
                        setEditProductData((prev) => ({
                          ...prev,
                          deliveryStates: [],
                        }));
                      }
                      if (e.target.value !== "city") {
                        setEditProductData((prev) => ({
                          ...prev,
                          deliveryCities: [],
                        }));
                      }
                    }}
                    Options={[
                      { label: "All India", value: "all" },
                      { label: "State Selection", value: "state" },
                      { label: "City Selection", value: "city" },
                    ]}
                  />
                </div>

                {/* State Multi-Select */}
                {editDeliveryScope === "state" && (
                  <div className="flex items-start justify-center col-span-2">
                    <MultiSelect
                      label="Select States"
                      options={Object.keys(PinCodeData).map((state) => ({
                        label: state,
                        value: state,
                      }))}
                      selected={editProductData.deliveryStates || []}
                      onChange={(values) =>
                        setEditProductData((prev) => ({
                          ...prev,
                          deliveryStates: values,
                        }))
                      }
                    />
                  </div>
                )}

                {/* City Multi-Select */}
                {editDeliveryScope === "city" && (
                  <div className="flex items-start justify-center col-span-2">
                    <MultiSelect
                      label="Select Cities"
                      options={Object.entries(PinCodeData).flatMap(
                        ([state, cities]) =>
                          Object.keys(cities).map((city) => ({
                            label: `${city} (${state})`,
                            value: city,
                          }))
                      )}
                      selected={editProductData.deliveryCities || []}
                      onChange={(values) =>
                        setEditProductData((prev) => ({
                          ...prev,
                          deliveryCities: values,
                        }))
                      }
                    />
                  </div>
                )}
                <div className="flex items-start justify-center">
                  <TextArea
                    LabelName="Policy Description"
                    Name="policyDescription"
                    Placeholder="Enter product's policy description"
                    className="max-h-20 min-h-20"
                    // Required={false}
                    Value={
                      editProductData.productPolicy.policyDescription || ""
                    }
                    onChange={handleEditChange}
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
            <InputBox
              Type="text"
              Placeholder={"Search by Product name..."}
              Value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...filteredProducts].reverse().map((product) => (
              <div
                key={product?._id}
                className="mx-2 p-4 border rounded-lg shadow-md bg-gray-100"
              >
                <h3 className=" text-gray-900 flex items-center justify-start truncate">
                  <strong>Name</strong>: {product?.name}{" "}
                </h3>
                <div className="flex">
                  <span className=" p-1 rounded-xl flex items-center  ">
                    <img
                      src={product?.images?.[0]?.url}
                      className="min-w-20 h-20 m-1 rounded-xl  shadow object-contain"
                      alt={product?.images?.[0]?.altText || product?.name}
                    />
                  </span>

                  <div className="flex flex-col items-center justify-evenly px-1">
                    {product?.status === "inactive" ? (
                      <div>
                        <h1 className="bg-neutral-300 text-center px-4 py-2 rounded-2xl cursor-not-allowed mt-2 text-xs ">
                          Product is under review
                        </h1>
                      </div>
                    ) : (
                      <div className="w-full">
                        <button
                          className="flex justify-evenly items-center w-full "
                          onClick={() => {
                            setUrlData({ productId: product?._id });
                            setPopup((prev) => ({ ...prev, image: true }));
                          }}
                          title="Add images"
                        >
                          <CircleFadingPlus className="w-4 h-4" />{" "}
                          <span> Image</span>
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          title="Edit product"
                          className="flex justify-evenly items-center w-full "
                        >
                          <Pencil className="w-4 h-4" /> <span>Product</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="truncate">
                  <strong>Description</strong>: {product?.description}
                </p>
                <p className="truncate">
                  <strong>Category:</strong> {product?.category?.title} -{" "}
                  {product?.subcategory?.title}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {product?.price?.sellingPrice}
                </p>
                <p>
                  <strong>Stock:</strong> {product?.stockQuantity}
                </p>
                <p>
                  <strong>Platform Charges:</strong> ₹
                  {product?.commission?.amount || "NA"}
                </p>
                {product?.status === "inactive" ? (
                  <div>
                    <h1 className="bg-neutral-300 text-center px-4 py-2 rounded-2xl cursor-not-allowed mt-2 text-xs">
                      Product is under review
                    </h1>
                  </div>
                ) : (
                  <Button
                    label="Delete"
                    Type="button"
                    className="mt-2 w-full hover:bg-red-500"
                    onClick={() => handleDeleteProduct(product?._id)}
                  />
                )}
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
                return Math.max(0, 10 - (product?.images?.length || 0));
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingUI(Products);
