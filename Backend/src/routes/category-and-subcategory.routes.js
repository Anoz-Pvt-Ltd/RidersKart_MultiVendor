import Router from "express";
import {
  AddCategory,
  AddSubcategory,
  DeleteCategory,
  DeleteSubcategory,
  getAllMainSubcategories,
} from "../controllers/category-and-subcategory.controller.js";
import { VerifyAdminUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/main-category/add").post(VerifyAdminUser, AddCategory);
router.route("/main-category/delete").delete(VerifyAdminUser, DeleteCategory);
router.route("/sub-category/add").post(VerifyAdminUser, AddSubcategory);
router.route("/sub-category/delete").delete(VerifyAdminUser, DeleteSubcategory);
router.route("/get-all-main-sub-categories").get(getAllMainSubcategories);

export default router;
