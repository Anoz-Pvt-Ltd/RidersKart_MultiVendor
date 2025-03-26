import { Router } from "express";
import {
  loginAdmin,
  regenerateRefreshToken,
  registerAdmin,
  updateData,
} from "../controllers/admin.controllers.js";
import { VerifyAdminUser } from "../middlewares/auth.middleware.js";
import {
  AddCategory,
  AddSubcategory,
  DeleteCategory,
} from "../controllers/category-and-subcategory.controller.js";

const router = Router();

router.route("/admin-register").post(registerAdmin);
router.route("/admin-login").post(loginAdmin);
router.route("/re-login").post(VerifyAdminUser, regenerateRefreshToken);

// Category routes
router.route("/category/add-category").post(VerifyAdminUser, AddCategory);
router
  .route("/category/delete-category")
  .delete(VerifyAdminUser, DeleteCategory);
router.route("/category/add-subcategory").post(VerifyAdminUser, AddSubcategory);
router
  .route("/category/delete-subcategory")
  .delete(VerifyAdminUser, AddCategory);

router.route("/update-data").post(VerifyAdminUser, updateData);

export default router;
