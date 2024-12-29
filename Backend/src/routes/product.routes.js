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
import { VerifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

//routes without authorization (public)
router.route("/register-product/:vendorId").post(VerifyUser, registerProduct);
router.route("/get-all-product").get(getAllProducts);
router.route("/get-single-product/:productId").get(getProduct);

//routes with authorization (private)
router
  .route("/get-all-product-of-vendor/:vendorId")
  .get(VerifyUser, getProductsOfVendor);
router
  .route("/get-all-product/:category/:subcategory")
  .get(getProductByCategory);
router.route("/edit-product").post(VerifyUser, editProduct);
router.route("/delete-products/:productId").delete(VerifyUser, deleteProduct);

export default router;
