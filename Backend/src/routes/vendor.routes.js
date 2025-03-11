import { Router } from "express";
import {
  getVendorData,
  loginVendor,
  regenerateRefreshToken,
  registerVendor,
  editVendor,
  deleteVendor,
  getVendorDetailsByProductId,
  getAllVendors,
  getCurrentVendor,
  getVerifiedVendors,
  getUnverifiedVendors,
} from "../controllers/Vendor.controllers.js";
import {
  VerifyVendorUser,
  VerifyAdminUser,
} from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(VerifyVendorUser);

router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);
router.route("/re-login").post(regenerateRefreshToken);
router.route("/vendor-profile/:vendorId").get(getVendorData);
router.route("/edit-vendor").post(editVendor);
router.route("/delete-vendor").post(deleteVendor);
router
  .route("/get-vendor-by-product-id/:productId")
  .get(getVendorDetailsByProductId);

//admin routes
router.route("/admin/get-all-vendor").get(VerifyAdminUser, getAllVendors);
router
  .route("/admin/get-all-verified-vendor")
  .get(VerifyAdminUser, getVerifiedVendors);
router
  .route("/admin/get-all-unverified-vendor")
  .get(VerifyAdminUser, getUnverifiedVendors);
router
  .route("/admin/get-current-vendor/:vendorId")
  .get(VerifyAdminUser, getCurrentVendor);
router.route("/admin/ban-vendor/:vendorId").post(VerifyAdminUser, deleteVendor);
router
  .route("/admin/delete-vendor/:vendorId")
  .delete(VerifyAdminUser, deleteVendor);

export default router;
