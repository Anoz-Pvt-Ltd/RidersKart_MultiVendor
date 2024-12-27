import { Router } from "express";
import {
  getVendorData,
  loginVendor,
  regenerateRefreshToken,
  registerVendor,
  editVendor,
  deleteVendor,
} from "../controllers/Vendor.controllers.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(VerifyUser);

router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);
router.route("/re-login").post(regenerateRefreshToken);
router.route("/vendor-profile/:vendorId").get(getVendorData);
router.route("/edit-vendor").post(editVendor);
router.route("/delete-vendor").post(deleteVendor);

export default router;
