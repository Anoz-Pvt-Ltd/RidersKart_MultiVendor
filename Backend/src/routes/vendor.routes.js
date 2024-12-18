import { Router } from "express";
import {
  loginVendor,
  registerVendor,
} from "../controllers/Vendor.controllers.js";

const router = Router();

router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);

export default router;
