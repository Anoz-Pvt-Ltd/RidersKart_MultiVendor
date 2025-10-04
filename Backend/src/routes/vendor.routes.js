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
  rejectVendor,
  acceptVendor,
  VendorBan,
  generateOTP,
  resetPasswordWithOTP,
  vendorLocation,
} from "../controllers/Vendor.controllers.js";
import {
  VerifyVendorUser,
  VerifyAdminUser,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router.use(VerifyVendorUser);

router.route("/register").post(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "canceledCheque", maxCount: 1 },
  ]),
  registerVendor
);
router.route("/login").post(loginVendor);
router.route("/re-login").post(regenerateRefreshToken);
router.route("/vendor-profile/:vendorId").get(getVendorData);
router.route("/edit-vendor").post(editVendor);
router.route("/delete-vendor/:vendorId").post(deleteVendor);
router
  .route("/update-location/:vendorId")
  .post(VerifyVendorUser, vendorLocation);
router
  .route("/get-vendor-by-product-id/:productId")
  .get(getVendorDetailsByProductId);

router.route("/forget-password/generate-otp").post(generateOTP);
router.route("/forget-password/reset-password").post(resetPasswordWithOTP);

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
router.route("/admin/ban-vendor/:vendorId").post(VerifyAdminUser, VendorBan);
router
  .route("/admin/delete-vendor/:vendorId")
  .delete(VerifyAdminUser, deleteVendor);

router
  .route("/admin/reject-vendor/:vendorId")
  .get(VerifyAdminUser, rejectVendor);
router
  .route("/admin/accept-vendor/:vendorId")
  .get(VerifyAdminUser, acceptVendor);

export default router;
