import { Brand } from "../models/brand.model.js";
import { Subcategory } from "../models/sub-category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadImages } from "../utils/imageKit.io.js";

const AddNewBrand = asyncHandler(async (req, res) => {
  const { brand, subcategoryId } = req.body;
  // console.log("brand :", brand);

  if (!brand) throw new ApiError(400, "Brand name is required");

  const ifExists = await Brand.findOne({ title: brand });
  if (ifExists) throw new ApiError(400, "Brand already exists");

  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) throw new ApiError(404, "Subcategory not found");

  // Add logo for this new brand to database
  const imageFile = req.file;
  if (!imageFile) throw new ApiError(400, "No brand logo provided");
  const logo = await UploadImages(
    imageFile.filename,
    {
      folderStructure: `all-brands/${brand.split(" ").join("-")}`,
    },
    [brand]
  );
  if (!logo) throw new ApiError(500, "Failed to upload brand image");

  const newBrand = await Brand.create({
    title: brand,
    logo: { url: logo.url, fileId: logo.fileId },
    status: "verified",
    subcategory: [subcategoryId],
  });

  if (!newBrand)
    throw new ApiError(
      500,
      "Failed to create brand due to some internal error! Please try again"
    );

  res
    .status(201)
    .json(new ApiResponse(201, newBrand, "Brand Added successfully"));
});

const AddBrandRequest = asyncHandler(async (req, res) => {
  const { brand } = req.body;
  if (!brand) throw new ApiError(400, "Brand name is required");

  // Check if brand name already exists in database for another brand
  const ifExists = await Brand.findOne({ title: brand });
  if (ifExists) throw new ApiError(400, "Brand already exists");

  // Add logo for this new brand to database
  const imageFile = req.file;
  if (!imageFile) throw new ApiError(400, "No brand logo provided");
  const logo = await UploadImages(
    imageFile.filename,
    {
      folderStructure: `all-brands/${brand.split(" ").join("-")}`,
    },
    [brand]
  );
  if (!logo) throw new ApiError(500, "Failed to upload brand image");

  // Add brand request to database
  const newBrandRequest = await Brand.create({
    title: brand,
    logo: { url: logo.url, fileId: logo.fileId },
  });

  if (!newBrandRequest)
    throw new ApiError(
      500,
      "Failed to create brand request due to some internal error! Please try again"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newBrandRequest,
        "Brand request added successfully. Brand will be verified once approved."
      )
    );
});

const EditBrandName = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const { brand } = req.body;

  if (!brandId) throw new ApiError(400, "Brand ID is required");
  if (!brand) throw new ApiError(400, "Brand name is required");

  // Check if brand id is valid or not
  const existingBrand = await Brand.findById(brandId);
  if (!existingBrand) throw new ApiError(404, "Brand not found");
  if (existingBrand.title === brand)
    throw new ApiError(400, "Brand name is the same");

  // Check if brand name already exists in database for another brand
  const ifExists = await Brand.findOne({ title: brand });
  if (ifExists) throw new ApiError(400, "Brand already exists");

  // Update brand name in database
  existingBrand.title = brand;
  await existingBrand.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, existingBrand, "Brand name updated successfully")
    );
});

const EditBrandLogo = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  if (!brandId) throw new ApiError(400, "Brand ID is required");

  const existingBrand = await Brand.findById(brandId);
  if (!existingBrand) throw new ApiError(404, "Brand not found");

  // Add new logo for this brand to database
  const imageFile = req.file;
  if (!imageFile) throw new ApiError(400, "No brand logo provided");
  const logo = await UploadImages(
    imageFile.filename,
    {
      folderStructure: `all-brands/${existingBrand.title.split(" ").join("-")}`,
    },
    [existingBrand.title]
  );
  if (!logo) throw new ApiError(500, "Failed to upload brand image");

  existingBrand.logo = { url: logo.url, fileId: logo.fileId };
  await existingBrand.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, existingBrand, "Brand logo updated successfully")
    );
});

const GetBrandById = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) throw new ApiError(404, "Brand not found");

  res
    .status(200)
    .json(new ApiResponse(200, brand, "Brand retrieved successfully"));
});

const VerifyBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) throw new ApiError(404, "Brand not found");

  if (brand.status === "verified")
    throw new ApiError(400, "Brand is already Verified");

  brand.status = "verified";
  await brand.save();

  res
    .status(200)
    .json(new ApiResponse(200, brand, "Brand status updated successfully"));
});

const DeactivateBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) throw new ApiError(404, "Brand not found");

  if (brand.status === "under-review")
    throw new ApiError(400, "Brand is already in under-review state!");

  brand.status = "under-review";
  await brand.save();

  res
    .status(200)
    .json(new ApiResponse(200, brand, "Brand status updated successfully"));
});

const DeleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const brand = await Brand.findByIdAndDelete(brandId);
  if (!brand) throw new ApiError(404, "Brand not found");

  res
    .status(200)
    .json(new ApiResponse(200, brand, "Brand deleted successfully"));
});

const GetAllVerifiedBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ status: "verified" });
  if (!brands)
    res.status(201).json(new ApiResponse(201, null, "Brands not found"));
  else
    res
      .status(201)
      .json(new ApiResponse(201, brands, "Brands fetched successfully"));
});

const GetAllUnderReviewBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ status: "under-review" });
  if (!brands)
    res.status(201).json(new ApiResponse(201, null, "Brands not found"));
  else
    res
      .status(201)
      .json(new ApiResponse(201, brands, "Brands fetched successfully"));
});

const GetAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  if (!brands)
    res.status(201).json(new ApiResponse(201, null, "Brands not found"));
  else
    res
      .status(200)
      .json(new ApiResponse(201, brands, "Brands fetched successfully"));
});

const LinkSubcategoryToBrands = asyncHandler(async (req, res) => {
  const { brandId, subcategoryId } = req.body;

  if (!brandId) throw new ApiError(400, "Brand ID is required");
  if (!subcategoryId) throw new ApiError(400, "Subcategory ID is required");

  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) throw new ApiError(404, "Subcategory not found");

  const brand = await Brand.findByIdAndUpdate(
    brandId,
    {
      $push: { subcategory: subcategoryId },
    },
    { new: true }
  );
  if (!brand) throw new ApiError(404, "Brand not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, brand, "brand linked to Subcategory successfully")
    );
});

export {
  AddNewBrand,
  AddBrandRequest,
  EditBrandName,
  EditBrandLogo,
  GetBrandById,
  VerifyBrand,
  DeactivateBrand,
  DeleteBrand,
  GetAllVerifiedBrands,
  GetAllUnderReviewBrands,
  GetAllBrands,
  LinkSubcategoryToBrands,
};
