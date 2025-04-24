import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import {
  CreatePaymentId,
  ValidatePayment,
} from "../controllers/payment.controller.js";

const router = Router();
router.use(VerifyUser);

router.route("/create-new-paymentId").post(CreatePaymentId);
router.route("/validate-payment").post(ValidatePayment);

export default router;
