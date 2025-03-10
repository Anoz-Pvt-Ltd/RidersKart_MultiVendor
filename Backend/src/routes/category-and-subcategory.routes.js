import Router from "express";
import {
  AddCategory,
  AddSubcategory,
  DeleteCategory,
  DeleteSubcategory,
  editSubcategory,
  getAllMainSubcategories,
} from "../controllers/category-and-subcategory.controller.js";
import { VerifyAdminUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/main-category/add")
  .post(VerifyAdminUser, upload.single("image"), AddCategory);
router.route("/main-category/delete").delete(VerifyAdminUser, DeleteCategory);
router
  .route("/sub-category/add")
  .post(VerifyAdminUser, upload.single("image"), AddSubcategory);
router.route("/sub-category/delete").delete(VerifyAdminUser, DeleteSubcategory);
router.route("/get-all-main-sub-categories").get(getAllMainSubcategories);
router
  .route("/edit-sub-category/:subcategoryId")
  .post(VerifyAdminUser, upload.single("image"), editSubcategory);

export default router;
