import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import { RegisterDriver } from "../controllers/driver.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "racFrontImage", maxCount: 1 },
    { name: "racBackImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
    { name: "pollutionImage", maxCount: 1 },
  ]),
  RegisterDriver
);

export default router;
