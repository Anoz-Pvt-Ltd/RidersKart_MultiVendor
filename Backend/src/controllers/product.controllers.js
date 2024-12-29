import { Product } from "../models/products.models.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { categories } from "../utils/constants.js";

// Controller to register a new product
const registerProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    price,
    stockQuantity,
    sku,
    images,
    specifications,
    tags,
  } = req.body;
  console.log("Controller Reached");

  const vendorId = req.user._id;
  console.log(vendorId);

  // Validate required fields
  if (
    !name ||
    !description ||
    !category?.main ||
    !category?.sub ||
    !price ||
    !stockQuantity ||
    !sku
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }

  // Validate main category
  const mainCategoryData = categories.find(
    (cat) => cat.title === category.main
  );
  if (!mainCategoryData) {
    throw new ApiError(400, "Invalid main category");
  }

  // Validate subcategory
  if (!mainCategoryData.items.includes(category.sub)) {
    throw new ApiError(
      400,
      "Invalid subcategory for the selected main category"
    );
  }

  // Check if SKU already exists
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    throw new ApiError(400, "A product with this SKU already exists");
  }

  // Verify vendor exists
  const vendor = await VendorUser.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Create a new product instance
  const newProduct = new Product({
    name,
    description,
    category,
    price,
    stockQuantity,
    sku,
    images,
    specifications,
    tags,
    vendor: vendorId,
  });

  // Save the product to the database
  await newProduct.save();

  // Add the product to the vendor's products list
  vendor.products.push(newProduct._id);
  await vendor.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product: newProduct },
        "Product added successfully"
      )
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  const response = new ApiResponse(
    200,
    products,
    "Products fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

const getProductsOfVendor = asyncHandler(async (req, res) => {
  // console.log("controller reached");
  const { vendorId } = req.params;

  if (!vendorId) throw new ApiError(400, "Vendor ID is required");

  // Fetch the products of the given vendor ID
  const vendor = await VendorUser.findById(vendorId).populate("products");
  if (!vendor) throw new ApiError(404, "Vendor not found");

  const response = new ApiResponse(
    200,
    vendor.products,
    "Products fetched successfully"
  );
  res.status(response.statusCode).json(response);
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the product by ID
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Find and update the product by ID
  const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation is run on updates
  });

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find the product by ID
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Delete the product
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

const getProductByCategory = asyncHandler(async (req, res) => {
  console.log("Fetching products by category");

  const { category, subcategory } = req.params;

  // Check if both category and subcategory are provided
  if (!category || !subcategory) {
    return res.status(400).json({
      success: false,
      message: "Category and subcategory are required.",
    });
  }

  // Fetch the product by category and subcategory
  const products = await Product.find({
    "category.main": category,
    "category.sub": subcategory,
  });

  // Check if products are found
  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found for the selected category and subcategory.",
    });
  }

  // Return the found products
  return res.status(200).json({
    success: true,
    data: products,
  });
});

export {
  registerProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getProductsOfVendor,
  getProductByCategory,
};
