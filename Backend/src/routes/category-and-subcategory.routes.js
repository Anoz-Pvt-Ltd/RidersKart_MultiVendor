import Router from "express";
import {
  AddCategory,
  AddSubcategory,
  DeleteCategory,
  DeleteSubcategory,
  editSubcategory,
  getAllMainSubcategories,
  AddCategoryRequest,
  UnderReviewCategoryRequest,
  VerifyCategory,
} from "../controllers/category-and-subcategory.controller.js";
import {
  VerifyAdminUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/category/add")
  .post(VerifyAdminUser, upload.single("image"), AddCategory);
router
  .route("/category-request-vendor/add")
  .post(VerifyVendorUser, upload.single("image"), AddCategoryRequest);
router
  .route("/category/accept/:categoryId")
  .post(VerifyAdminUser, VerifyCategory);
router
  .route("/category/delete/:categoryId")
  .delete(VerifyAdminUser, DeleteCategory);
router
  .route("/sub-category/add")
  .post(VerifyAdminUser, upload.single("image"), AddSubcategory);
router.route("/sub-category/delete").delete(VerifyAdminUser, DeleteSubcategory);
router
  .route("/get-all-category-and-subcategories")
  .get(getAllMainSubcategories);
router
  .route("/edit-sub-category/:subcategoryId")
  .post(VerifyAdminUser, upload.single("image"), editSubcategory);
router.route("/under-review-category").get(UnderReviewCategoryRequest);

export default router;
