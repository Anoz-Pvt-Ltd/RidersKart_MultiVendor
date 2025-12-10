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
  markOrderAsConfirm,
  markOrderAsShipped,
  markOrderAsReadyForShipment,
  UserCancelOrder,
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
router.route("/get-vendor-orders/:vendorId").get(getVendorAllOrders);
router.route("/all-products-of/:userId").get(VerifyUser, getUserAllOrders);
// router
//   .route("/all-products-of-vendor/:vendorId")
//   .get( getVendorAllOrders);

router.route("/update-order-status").post(VerifyUser, updateOrderStatus);
router
  .route("/cancel-order-by-user/:orderId")
  .post(VerifyUser, UserCancelOrder);
router.route("/cancel-order/:orderId").post(VerifyVendorUser, CancelOrder);
router
  .route("/mark-order-as-confirm/:orderId")
  .post(VerifyVendorUser, markOrderAsConfirm);
router
  .route("/mark-order-as-ready-for-shipment/:orderId")
  .post(VerifyVendorUser, markOrderAsReadyForShipment);
router
  .route("/mark-order-as-shipped/:orderId")
  .post(VerifyVendorUser, markOrderAsShipped);
router.route("/update-payment-status").post(VerifyUser, updatePaymentStatus);

router
  .route("/get-current-order/:orderId")
  .get(VerifyVendorUser, getCurrentOrder);

//admin routes
router.route("/admin/all-orders").get(getAllOrders);
router.route("/admin/current-order/:orderId").get(getCurrentOrder);
router.route("/admin/cash-on-delivery-orders").get(allCashOnDeliveryOrders);
router.route("/admin/update-order-status").post(updateOrderStatus);
router.route("/admin/update-payment-status").post(updatePaymentStatus);
router.route("/admin/get-vendor-orders-report").post(getVendorsOrderReport);

export default router;
