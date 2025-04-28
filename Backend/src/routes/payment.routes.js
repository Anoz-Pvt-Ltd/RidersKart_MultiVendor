import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import {
  CreatePaymentId,
  GetAllPayments,
  GetPaymentsById,
  ValidatePayment,
} from "../controllers/payment.controller.js";

const router = Router();
// router.use(VerifyUser);

router.route("/create-new-paymentId").post(VerifyUser, CreatePaymentId);
router.route("/validate-payment").post(VerifyUser, ValidatePayment);

//admin routes
router.route("/admin/get-all-online-payments").get(GetAllPayments);
router.route("/admin/get-online-payments/:transactionId").get(GetPaymentsById);

export default router;
