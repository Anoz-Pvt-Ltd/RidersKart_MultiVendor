import { Router } from "express";
import {
  getVendorData,
  loginVendor,
  regenerateRefreshToken,
  registerVendor,
  editVendor,
  deleteVendor,
} from "../controllers/Vendor.controllers.js";
import { VerifyVendorUser } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(VerifyVendorUser);

router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);
router.route("/re-login").post(regenerateRefreshToken);
router.route("/vendor-profile/:vendorId").get(getVendorData);
router.route("/edit-vendor").post(editVendor);
router.route("/delete-vendor").post(deleteVendor);

export default router;
