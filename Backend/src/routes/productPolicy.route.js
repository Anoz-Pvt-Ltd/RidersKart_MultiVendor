import { Router } from "express";
import {
  createProductPolicy,
  deleteProductPolicy,
  getAllProductPolicies,
  getApplicablePolicies,
  getProductPolicyById,
  updateProductPolicy,
} from "../controllers/productPolicy.controller.js";
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

router.route("/policy-by-category").get(getApplicablePolicies);

export default router;
