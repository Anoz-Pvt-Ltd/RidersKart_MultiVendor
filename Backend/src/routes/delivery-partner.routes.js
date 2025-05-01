import { Router } from "express";
import { VerifyVendorUser } from "../middlewares/auth.middleware.js";
import {
  AcceptRequest,
  BanDriver,
  DeleteDriver,
  GetActiveOrder,
  GetAllRegistrationRequests,
  GetAllVerifiedDrivers,
  GetDriver,
  RegisterDriver,
  RejectRequest,
  ToggleActiveDriver,
  ToggleSuspendDriver,
} from "../controllers/driver.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(VerifyVendorUser);

router.route("/register/:vendorId").post(
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

router.route("/active-order/:driverId").get(GetActiveOrder);
router.route("/driver/:driverId").get(GetDriver).delete(DeleteDriver);

router.route("/registration-request").get(GetAllRegistrationRequests);
router.route("/verified-drivers").get(GetAllVerifiedDrivers);

router
  .route("/driver-request/:requestId")
  .patch(AcceptRequest)
  .delete(RejectRequest);

router.route("/ban-driver/:driverId").post(BanDriver);

router.route("/toggle-suspension/:driverId").patch(ToggleSuspendDriver);
router.route("/toggle-active/:driverId").patch(ToggleActiveDriver);

export default router;
