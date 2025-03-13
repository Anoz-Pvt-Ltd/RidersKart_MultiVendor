import { Router } from "express";
import {
  GetAllVerifiedBrands,
  AddBrandRequest,
  AddNewBrand,
  DeactivateBrand,
  DeleteBrand,
  EditBrandLogo,
  EditBrandName,
  GetAllBrands,
  GetAllUnderReviewBrands,
  GetBrandById,
  VerifyBrand,
} from "../controllers/brand.controller.js";
import {
  VerifyAdminUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// admin routes
router
  .route("/admin/add-new-brand")
  .post(VerifyAdminUser, upload.single("image"), AddNewBrand);
router
  .route("/admin/get-all-non-verified-brands")
  .get(VerifyAdminUser, GetAllUnderReviewBrands);
router
  .route("/admin/get-all-verified-brands")
  .get(VerifyAdminUser, GetAllVerifiedBrands);
router
  .route("/admin/verify-brand-request/:brandId")
  .post(VerifyAdminUser, VerifyBrand);

// vendor routes
router
  .route("/vendor/add-brand-request")
  .post(VerifyVendorUser, AddBrandRequest);

export default router;
