import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ProductPolicy } from "../models/productPolicy.model.js";

/**
 * @desc    Create a new product policy
 * @route   POST /api/v1/policies
 * @access  Private (Admin/SuperAdmin)
 */
const createProductPolicy = asyncHandler(async (req, res) => {
  const {
    title,
    policy,
    termsAndConditions,
    description,
    shortSummary,
    policyType,
    policyFor,
    category,
    subcategory,
    brand,
    products,
    appliesToAllCategories,
    appliesToAllSubcategories,
    appliesToAllBrands,
    effectiveDate,
    expiryDate,
    isActive,
    region,
    country,
    state,
    city,
    language,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !termsAndConditions ||
    !policy ||
    !policyType ||
    !policyFor ||
    !effectiveDate
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  // Check if policy already exists with the same title
  const existingPolicy = await ProductPolicy.findOne({ title });
  if (existingPolicy) {
    throw new ApiError(409, "Policy with this title already exists");
  }

  // Create new policy
  const newPolicy = await ProductPolicy.create({
    title,
    policy,
    termsAndConditions,
    description,
    shortSummary,
    policyType,
    policyFor,
    category,
    subcategory,
    brand,
    products,
    appliesToAllCategories,
    appliesToAllSubcategories,
    appliesToAllBrands,
    effectiveDate,
    expiryDate,
    isActive,
    createdBy: req.user._id,
    region,
    country,
    state,
    city,
    language,
  });

  if (!newPolicy) {
    throw new ApiError(500, "Failed to create product policy");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newPolicy, "Product policy created successfully")
    );
});

/**
 * @desc    Get all product policies
 * @route   GET /api/v1/policies
 * @access  Public (or Private if needed)
 */
const getAllProductPolicies = asyncHandler(async (req, res) => {
  const policies = await ProductPolicy.find().populate([
    "category",
    "subcategory",
    "brand",
    "products",
    "createdBy",
    "updatedBy",
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, policies, "Policies fetched successfully"));
});

/**
 * @desc    Get a single product policy by ID
 * @route   GET /api/v1/policies/:id
 * @access  Public (or Private if needed)
 */
const getProductPolicyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const policy = await ProductPolicy.findById(id).populate([
    "category",
    "subcategory",
    "brand",
    "products",
    "createdBy",
    "updatedBy",
  ]);

  if (!policy) {
    throw new ApiError(404, "Product policy not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, policy, "Policy fetched successfully"));
});

/**
 * @desc    Update a product policy
 * @route   PUT /api/v1/policies/:id
 * @access  Private (Admin/SuperAdmin)
 */
const updateProductPolicy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if policy exists
  const existingPolicy = await ProductPolicy.findById(id);
  if (!existingPolicy) {
    throw new ApiError(404, "Product policy not found");
  }

  // Prevent duplicate titles
  if (updateData.title && updateData.title !== existingPolicy.title) {
    const duplicatePolicy = await ProductPolicy.findOne({
      title: updateData.title,
    });
    if (duplicatePolicy) {
      throw new ApiError(409, "Policy with this title already exists");
    }
  }

  // Update policy
  const updatedPolicy = await ProductPolicy.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updatedBy: req.user._id,
    },
    { new: true }
  ).populate([
    "category",
    "subcategory",
    "brand",
    "products",
    "createdBy",
    "updatedBy",
  ]);

  if (!updatedPolicy) {
    throw new ApiError(500, "Failed to update product policy");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPolicy, "Policy updated successfully"));
});

/**
 * @desc    Delete a product policy
 * @route   DELETE /api/v1/policies/:id
 * @access  Private (Admin/SuperAdmin)
 */
const deleteProductPolicy = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const policy = await ProductPolicy.findByIdAndDelete(id);

  if (!policy) {
    throw new ApiError(404, "Product policy not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Policy deleted successfully"));
});


export {
  createProductPolicy,
  getAllProductPolicies,
  getProductPolicyById,
  updateProductPolicy,
  deleteProductPolicy,
};
