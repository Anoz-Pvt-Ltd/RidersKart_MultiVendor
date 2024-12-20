import { Product } from "../models/products.models.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller to register a new product
const registerProduct = asyncHandler(async (req, res, next) => {
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

  //   const vendorId = req.user._id; // Assumes vendor's ID is available via authentication middleware

  // Validate required fields
  if (!name || !description || !category || !price || !stockQuantity || !sku) {
    return next(new ApiError(400, "All required fields must be filled"));
  }

  // Validate category
  const validCategories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Health",
    "Books",
    "Toys",
    "Sports",
    "Automotive",
  ];
  if (!validCategories.includes(category)) {
    return next(new ApiError(400, "Invalid category"));
  }

  // Check if SKU already exists
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    return next(new ApiError(400, "A product with this SKU already exists"));
  }

  // Verify vendor exists
  const vendor = await VendorUser.findById(_id);
  if (!vendor) {
    return next(new ApiError(404, "Vendor not found"));
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
    vendor: _id,
  });

  // Save the product to the database
  await newProduct.save();

  // Add the product to the vendor's products list
  vendor.products.push(newProduct._id);
  await vendor.save();

  // Return success response
  const response = new ApiResponse(201, {
    product: newProduct,
  });

  res.status(response.statusCode).json(response);
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find(); // Fetch all products
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
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
  const { id } = req.params;

  // Find the product by ID
  const product = await Product.findById(id);

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

export {
  registerProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
};
