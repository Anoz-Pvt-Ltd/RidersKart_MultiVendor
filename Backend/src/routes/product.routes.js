import { Router } from "express";
import {
  registerProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getProductsOfVendor,
  getProductByCategory,
} from "../controllers/product.controllers.js";
import {
  VerifyUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";

const router = Router();

//routes without authorization (public)
router
  .route("/register-product/:vendorId")
  .post(VerifyVendorUser, registerProduct);
router.route("/get-all-product").get(getAllProducts);
router.route("/get-single-product/:productId").get(getProduct);

//routes with authorization (private)
router
  .route("/get-all-product-of-vendor/:vendorId")
  .get(VerifyVendorUser, getProductsOfVendor);
router
  .route("/get-all-product/:category/:subcategory")
  .get(getProductByCategory);
router.route("/edit-product").post(VerifyVendorUser, editProduct);
router
  .route("/delete-products/:productId")
  .delete(VerifyVendorUser, deleteProduct);

//routes for admin
router.route("/admin/get-all-products").get(getAllProducts);
router.route("/admin/get-single-product/:productId").get(getProduct);

export default router;
