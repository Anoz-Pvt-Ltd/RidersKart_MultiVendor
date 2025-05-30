import { Router } from "express";
import {
  createProductPolicy,
  deleteProductPolicy,
  getAllProductPolicies,
  getProductPolicyById,
  updateProductPolicy,
} from "../controllers/productPolicy.controller";
import {
  VerifyAdminUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/product-policy")
  .get(getAllProductPolicies)
  .post(VerifyAdminUser, createProductPolicy);

router
  .route("/product-policy/:id")
  .get(getProductPolicyById)
  .patch(VerifyAdminUser, updateProductPolicy)
  .delete(VerifyAdminUser, deleteProductPolicy);

export default router;
