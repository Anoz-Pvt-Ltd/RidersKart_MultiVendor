import { Router } from "express";

import {
  registerProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/register-product").post(registerProduct);
router.route("/get-all-product").post(getAllProducts);
router.route("/get-single-product").post(getProduct);
router.route("/edit-product").post(editProduct);
router.route("/delete-product").post(deleteProduct);

export default router;
