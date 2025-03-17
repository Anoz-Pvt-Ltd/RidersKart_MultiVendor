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

//public routes
router.route("/get-all-brands").get(GetAllBrands);
router.route("/get-brand-by-id/:brandId").get(GetBrandById);

// admin routes
router
  .route("/admin/get-all-non-verified-brands")
  .get(VerifyAdminUser, GetAllUnderReviewBrands);
router
  .route("/admin/get-all-verified-brands")
  .get(VerifyAdminUser, GetAllVerifiedBrands);
router
  .route("/admin/verify-brand-request/:brandId")
  .post(VerifyAdminUser, VerifyBrand);
router
  .route("/admin/add-new-brand")
  .post(VerifyAdminUser, upload.single("image"), AddNewBrand);

// vendor routes
router
  .route("/vendor/add-new-brand")
  .post(VerifyVendorUser, upload.single("image"), AddBrandRequest);

export default router;
