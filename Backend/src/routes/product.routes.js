import { Router } from "express";

import {
  registerProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getProductsOfVendor,
} from "../controllers/product.controllers.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(VerifyUser);

router.route("/register-product").post(registerProduct);
router.route("/get-all-product-of-vendor/:vendorId").get(getProductsOfVendor);
router.route("/get-all-product").post(getAllProducts);
router.route("/get-single-product").post(getProduct);
router.route("/edit-product").post(editProduct);
router.route("/delete-products/:productId").delete(deleteProduct);

export default router;
