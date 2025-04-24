import { Promotion } from "../models/promotion.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadImages } from "../utils/imageKit.io.js";

/**
 * @desc Create a new promotion with images
 * @route POST /api/promotions
 * @access Admin Only
 */
export const createPromotion = asyncHandler(async (req, res) => {
  const { title, type, discountValue, startDate, endDate } = req.body;

  console.log({ title, type, discountValue, startDate, endDate });

  if (!title || !type || !discountValue || !startDate || !endDate) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one image is required.");
  }

  // Upload each image and get URL & fileId
  const uploadedImages = await Promise.all(
    req.files.map(async (file) => {
      const uploadResponse = await UploadImages(
        file.filename,
        {
          folderStructure: `all-promotions/${title.split(" ").join("-")}/${startDate.split(" ").join("-")}`,
        },
        [title, startDate, endDate]
      ); // Upload to ImageKit
      return {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      };
    })
  );

  // Structure image data for lg, md, sm
  const images = {
    url: {
      lg: uploadedImages[0]?.url || "",
      md: uploadedImages[1]?.url || "",
      sm: uploadedImages[2]?.url || "",
    },
    fileId: {
      lg: uploadedImages[0]?.fileId || "",
      md: uploadedImages[1]?.fileId || "",
      sm: uploadedImages[2]?.fileId || "",
    },
  };

  const promotion = await Promotion.create({
    ...req.body,
    images,
    createdBy: req.user._id,
  });

  if (!promotion)
    throw new ApiError(
      500,
      "Failed to create promotion due to internal server error! Please try again."
    );

  res
    .status(201)
    .json(new ApiResponse(201, promotion, "Promotion created successfully"));
});

/**
 * @desc Get all promotions
 * @route GET /api/promotions
 * @access Public
 */
export const getAllPromotions = asyncHandler(async (req, res) => {
  const promotions = await Promotion.find({ status: "active" });

  if (!promotions.length)
    throw new ApiError(404, "No active promotions found.");

  res
    .status(200)
    .json(new ApiResponse(200, promotions, "Promotions fetched successfully"));
});

/**
 * @desc Get a single promotion by ID
 * @route GET /api/promotions/:id
 * @access Public
 */
export const getPromotionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const promotion = await Promotion.findById(id);
  if (!promotion) throw new ApiError(404, "Promotion not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, promotion, "Promotion details fetched successfully")
    );
});

/**
 * @desc Update a promotion
 * @route PUT /api/promotions/:id
 * @access Admin Only
 */
export const updatePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let promotion = await Promotion.findById(id);
  if (!promotion) throw new ApiError(404, "Promotion not found");

  promotion = await Promotion.findByIdAndUpdate(id, req.body, { new: true });

  res
    .status(200)
    .json(new ApiResponse(200, promotion, "Promotion updated successfully"));
});

/**
 * @desc Delete a promotion
 * @route DELETE /api/promotions/:id
 * @access Admin Only
 */
export const deletePromotion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const promotion = await Promotion.findById(id);
  if (!promotion) throw new ApiError(404, "Promotion not found");

  await Promotion.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Promotion deleted successfully"));
});

/**
 * @desc Apply a promotion by coupon code
 * @route POST /api/promotions/apply
 * @access Public
 */
export const applyPromotion = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  if (!couponCode) throw new ApiError(400, "Coupon code is required");

  const promotion = await Promotion.findOne({ couponCode, status: "active" });

  if (!promotion) throw new ApiError(404, "Invalid or expired coupon code");

  res
    .status(200)
    .json(new ApiResponse(200, promotion, "Promotion applied successfully"));
});
