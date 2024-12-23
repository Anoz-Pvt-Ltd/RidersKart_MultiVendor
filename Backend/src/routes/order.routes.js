import { Router } from "express";
import {
  CreateOrder,
  CancelOrder,
  GetVendorOrders,
} from "../controllers/order.controllers.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware to verify the user
router.use(VerifyUser);

//routes for orders
router.route("/create-order").post(CreateOrder);
router.route("/cancel-order/:orderId").delete(CancelOrder);
router.route("/get-vendor-orders/:vendorId").get(GetVendorOrders);

export default router;
