import { Router } from "express";
import {
  loginAdmin,
  regenerateRefreshToken,
  registerAdmin,
} from "../controllers/admin.controllers.js";
import { VerifyAdminUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/admin-register").post(registerAdmin);
router.route("/admin-login").post(loginAdmin);
router.route("/re-login").post(VerifyAdminUser, regenerateRefreshToken);

export default router;
