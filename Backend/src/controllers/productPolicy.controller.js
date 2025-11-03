import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ProductPolicy } from "../models/productPolicy.model.js";
import mongoose from "mongoose";

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

  // Convert "on"/"true" strings to booleans
  const toBool = (val) => val === "on" || val === "true" || val === true;

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
    appliesToAllCategories: toBool(appliesToAllCategories),
    appliesToAllSubcategories: toBool(appliesToAllSubcategories),
    appliesToAllBrands: toBool(appliesToAllBrands),
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
 * @desc    Get policies applicable to a specific product, category, subcategory, or brand
 * @route   GET /api/v1/policies/applicable
 * @access  Public
 * @query   {productId?, categoryId?, subcategoryId?, brandId?}
 */
const getApplicablePolicies = asyncHandler(async (req, res) => {
  const { productId, categoryId, subcategoryId, brandId } = req.query;

  if (!productId && !categoryId && !subcategoryId && !brandId) {
    throw new ApiError(400, "At least one entity ID is required");
  }

  const idsToCheck = [productId, categoryId, subcategoryId, brandId].filter(
    Boolean
  );

  for (const id of idsToCheck) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, `Invalid MongoDB ID: ${id}`);
    }
  }

  // console.log([{ productId }, { categoryId }, { subcategoryId }, { brandId }]);

  // 1. First fetch all policies that match ANY of these criteria
  const baseQuery = {
    $or: [
      { policyFor: "all" },
      ...(productId ? [{ policyFor: "product", products: productId }] : []),
      ...(categoryId ? [{ policyFor: "category", category: categoryId }] : []),
      ...(subcategoryId
        ? [{ policyFor: "subcategory", subcategory: subcategoryId }]
        : []),
      ...(brandId ? [{ policyFor: "brand", brand: brandId }] : []),
    ],
    isActive: true,
  };

  // 2. Also include policies that apply to all categories/brands if relevant
  const enhancedQuery = {
    $or: [
      baseQuery,
      ...(categoryId ? [{ appliesToAllCategories: true }] : []),
      ...(brandId ? [{ appliesToAllBrands: true }] : []),
    ],
  };

  const policies = await ProductPolicy.find(baseQuery)
    .populate("category", "name")
    .populate("subcategory", "name")
    .populate("brand", "name")
    .populate("products", "name")
    .sort({ priority: -1 }); // Higher priority policies first

  console.log("policies", policies.length);

  // 3. Categorize policies by type for frontend convenience
  const categorizedPolicies = policies.reduce((acc, policy) => {
    const { policyType } = policy;
    if (!acc[policyType]) {
      acc[policyType] = [];
    }
    acc[policyType].push(policy);
    return acc;
  }, {});

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { policies, categorizedPolicies },
        "Applicable policies fetched successfully"
      )
    );
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
  getApplicablePolicies,
  updateProductPolicy,
  deleteProductPolicy,
};
