import { Category } from "../models/category.model.js";
import { Product } from "../models/products.models.js";
import { Subcategory } from "../models/sub-category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { DeleteImage, UploadImages } from "../utils/imageKit.io.js";

const AddCategory = asyncHandler(async (req, res) => {
  const { category, subcategory } = req.body;
  console.log("category", category);

  if (!category || !subcategory)
    throw new ApiError(404, "Category not found!!");

  if (typeof category !== "string" || typeof subcategory !== "string")
    throw new ApiError(400, "Invalid input type for category or subcategory!");

  const existingCategory = await Category.findOne({ title: category });
  if (existingCategory) throw new ApiError(400, "Category already exists!");

  const newCategory = await Category.create({
    title: category,
  });

  const imageFile = req.file;

  console.log("imageFile : ", imageFile);
  if (!imageFile) throw new ApiError(404, "Image file not found!");
  const image = await UploadImages(imageFile.filename, {
    folderStructure: `images-Of-Subcategory/${subcategory.split(" ").join("-")}`,
  });
  if (!image)
    throw new ApiError(500, "Failed to upload image! Please try again");

  const newSubcategory = await Subcategory.create({
    title: subcategory,
    category: newCategory._id,
    image: { url: image.url, alt: subcategory, fileId: image.fileId },
  });
  if (!newCategory || !newSubcategory)
    throw new ApiError(
      500,
      "Failed to create category or subcategory! Please try again"
    );

  newCategory.subcategories.push(newSubcategory._id);
  await newCategory.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { category: newCategory },
        "Successfully created a new category"
      )
    );
});

const AddCategoryRequest = asyncHandler(async (req, res) => {
  const { category, subcategory } = req.body;

  if (!category || !subcategory)
    throw new ApiError(404, "Category or Subcategory not found!");

  if (typeof category !== "string" || typeof subcategory !== "string")
    throw new ApiError(400, "Invalid input type for category or subcategory!");

  const existingCategoryRequest = await Category.findOne({
    title: category,
    subcategories: { $elemMatch: { title: subcategory } },
  });
  if (existingCategoryRequest)
    throw new ApiError(400, "Category request already exists!");

  const imageFile = req.file;
  if (!imageFile) throw new ApiError(404, "Image file not found!");
  const image = await UploadImages(imageFile.filename, {
    folderStructure: `images-Of-Subcategory/${subcategory.split(" ").join("-")}`,
  });
  if (!image)
    throw new ApiError(500, "Failed to upload image! Please try again");

  const newCategoryRequest = await Category.create({
    title: category,
  });
  if (!newCategoryRequest) throw new ApiError(404, "Category not found!");
  const newSubCategoryRequest = await Subcategory.create({
    title: subcategory,
    category: newCategoryRequest._id,
    image: { url: image.url, fileId: image.fileId },
  });
  if (!newSubCategoryRequest)
    throw new ApiError(404, "Sub Category not found!");

  res
    .status(201)
    .json(
      201,
      { category: newCategoryRequest, subCategory: newSubCategoryRequest },
      "Successfully requested a new category"
    );
});

const DeleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) throw new ApiError(404, "Category ID not found!");

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw new ApiError(404, "Category not found!");

  await Subcategory.deleteMany({ category: category._id });

  await Product.deleteMany({ category: category._id });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

const AddSubcategory = asyncHandler(async (req, res) => {
  const { categoryId, subcategory } = req.body;
  if (!categoryId || !subcategory)
    throw new ApiError(404, "Category or Subcategory not found!");

  if (typeof subcategory !== "string")
    throw new ApiError(400, "Invalid input type for subcategory!");

  const existingSubcategory = await Subcategory.findOne({
    title: subcategory,
    category: categoryId,
  });
  if (existingSubcategory)
    throw new ApiError(400, "Subcategory already exists!");

  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, "Category not found!");

  const imageFile = req.file;

  console.log("imageFile : ", imageFile);
  if (!imageFile) throw new ApiError(404, "Image file not found!");
  const image = await UploadImages(imageFile.filename, {
    folderStructure: `images-Of-Subcategory/${subcategory.split(" ").join("-")}`,
  });
  if (!image)
    throw new ApiError(500, "Failed to upload image! Please try again");

  const newSubcategory = await Subcategory.create({
    title: subcategory,
    category: category._id,
    image: { url: image.url, alt: subcategory, fileId: image.fileId },
  });
  if (!newSubcategory)
    throw new ApiError(500, "Failed to create subcategory! Please try again");

  category.subcategories.push(newSubcategory._id);
  await category.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { subcategory: newSubcategory },
        "Successfully created a new subcategory"
      )
    );
});

const DeleteSubcategory = asyncHandler(async (req, res) => {
  const { subcategoryId } = req.params;
  if (!subcategoryId) throw new ApiError(404, "Subcategory ID not found!");

  const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);
  if (!subcategory) throw new ApiError(404, "Subcategory not found!");

  const category = await Category.findByIdAndUpdate(
    subcategory.category,
    { $pull: { subcategories: subcategoryId } },
    { new: true }
  );

  if (!category)
    throw new ApiError(500, "Failed to Update category! Please try again");

  await Product.deleteMany({ subcategory: subcategory._id });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Subcategory deleted successfully"));
});

const getAllMainSubcategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate({
    path: "subcategories",
    populate: {
      path: "category",
      model: "Category",
    },
  });

  res.json(
    new ApiResponse(
      200,
      { categories },
      "Categories with subcategories fetched successfully"
    )
  );
});

const editSubcategory = asyncHandler(async (req, res) => {
  const { subcategoryId } = req.params;
  const { newTitle } = req.body;
  console.log("controller reached");
  console.log("newTitle", newTitle);
  console.log("subcategoryId", subcategoryId);

  if (!subcategoryId) {
    throw new ApiError(400, "Subcategory ID is required");
  }

  if (!newTitle || typeof newTitle !== "string") {
    throw new ApiError(400, "New title is required and must be a string");
  }

  const subcategory = await Subcategory.findById(subcategoryId);

  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }
  const imageFile = req.file;
  if (!imageFile) throw new ApiError(404, "Image file not found");

  if (subcategory.image.fileId) {
    const deletedImage = await DeleteImage(subcategory.image.fileId);
    if (!deletedImage)
      throw new ApiError(500, "Failed to delete previous image");
  }

  const image = await UploadImages(imageFile.filename, {
    folderStructure: `images-Of-Subcategory/${newTitle.split(" ").join("-")}`,
  });
  if (!image) throw new ApiError(500, "Failed to upload image");

  subcategory.title = newTitle;
  subcategory.image = { url: image.url, alt: newTitle, fileId: image.fileId };
  await subcategory.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, { subcategory }, "Subcategory updated successfully")
    );
});

export {
  AddCategory,
  AddCategoryRequest,
  DeleteCategory,
  AddSubcategory,
  DeleteSubcategory,
  getAllMainSubcategories,
  editSubcategory,
};
