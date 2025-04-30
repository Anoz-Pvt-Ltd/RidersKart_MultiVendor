import { Router } from "express";
import {
  CreateOrder,
  CancelOrder,
  GetVendorOrders,
  getUserAllOrders,
  getVendorAllOrders,
  getAllOrders,
  getCurrentOrder,
  updateOrderStatus,
  updatePaymentStatus,
  allCashOnDeliveryOrders,
  getVendorsOrderReport,
} from "../controllers/order.controllers.js";
import {
  VerifyUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware to verify the user
// router.use(VerifyUser);

//routes for orders
router.route("/create-order").post(VerifyUser, CreateOrder);
router.route("/cancel-order/:orderId").delete(VerifyUser, CancelOrder);
router.route("/get-vendor-orders/:vendorId").get(getVendorAllOrders);
router.route("/all-products-of/:userId").get(VerifyUser, getUserAllOrders);
// router
//   .route("/all-products-of-vendor/:vendorId")
//   .get( getVendorAllOrders);

router.route("/update-order-status").post(VerifyUser, updateOrderStatus);
router.route("/update-payment-status").post(VerifyUser, updatePaymentStatus);

//admin routes
router.route("/admin/all-orders").get(getAllOrders);
router.route("/admin/current-order/:orderId").get(getCurrentOrder);
router.route("/admin/cash-on-delivery-orders").get(allCashOnDeliveryOrders);
router.route("/admin/update-order-status").post(updateOrderStatus);
router.route("/admin/update-payment-status").post(updatePaymentStatus);
router.route("/admin/get-vendor-orders-report").post(getVendorsOrderReport);

export default router;
