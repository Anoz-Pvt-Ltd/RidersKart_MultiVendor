import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Razorpay from "razorpay";
import Crypto from "crypto";
import { paymentTransaction } from "../models/paymentTransaction.model.js";
import mongoose from "mongoose";

const CreatePaymentId = asyncHandler(async (req, res) => {
  const { options } = req.body;

  if (!options) throw new ApiError(401, "Options must be provided");

  // Ensure amount is in paise (multiply by 100)
  const paymentOptions = {
    // amount: options.amount * 100, // Convert to paise
    amount: 100, // For testing, set a fixed amount of 100 paise (1 INR)
    currency: options.currency,
    receipt: `receipt_${Date.now()}`, // Ensure a receipt is always there
    payment_capture: 1, // Auto-capture payment
  };

  console.log("Creating Razorpay Order with options:", paymentOptions);

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  try {
    const order = await razorpay.orders.create(paymentOptions);

    console.log("Razorpay Order Created:", order);

    if (!order || !order.id) throw new ApiError(500, "Order not created");

    res
      .status(200)
      .json(new ApiResponse(200, order, "Order created successfully"));
  } catch (error) {
    console.error("Error Creating Order:", error);
    throw new ApiError(500, "Failed to create order");
  }
});

// const ValidatePayment = asyncHandler(async (req, res) => {
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//     req.body;

//   if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
//     throw new ApiError(401, "Invalid request");
//   }

//   const sha = Crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//   sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//   const digest = sha.digest("hex");
//   if (digest !== razorpay_signature) {
//     return res
//       .status(450)
//       .json(new ApiResponse(401, {}, "Transaction is not legit!"));
//   }

//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { orderId: razorpay_order_id, paymentId: razorpay_payment_id },
//         "Payment validated"
//       )
//     );
// });

const ValidatePayment = asyncHandler(async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    paymentMethod,
    orderId,
  } = req.body;

  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature ||
    !amount ||
    !paymentMethod ||
    !orderId
  ) {
    throw new ApiError(401, "Invalid request");
  }

  if (!req.user._id) {
    throw new ApiError(405, "Authentication failed!!! Please reverify");
  }

  const sha = Crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res
      .status(450)
      .json(new ApiResponse(450, {}, "Transaction is not legit!"));
  }

  // Check if the orderId is valid and belongs to the user and also updating the order's payment status
  const order = await mongoose.model("Order").findById(orderId);
  if (!order) throw new ApiError(404, "Order not found !");
  if (!order.user.equals(req.user._id))
    throw new ApiError(403, "Unauthorized access to this order");

  order.paymentStatus = "completed";
  order.paymentMethod = "online";
  // order.orderStatus = "confirmed"; // Update order status to confirmed
  await order.save();

  const newTransaction = new paymentTransaction({
    razorpay_payment_id,
    razorpay_order_id,
    user: req.user._id,
    amount,
    paymentMethod: paymentMethod,
    order: orderId,
  });

  newTransaction.save();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        transaction: newTransaction,
      },
      "Payment validated and transaction recorded"
    )
  );
});

const GetPaymentHistory = asyncHandler(async (req, res) => {
  const { transactionId, userId } = req.params;

  if (!transactionId || !userId) {
    throw new ApiError(401, "Transaction ID or User ID not provided");
  }

  const payment = await paymentTransaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found or user not authorized");
  }

  res.status(200).json(new ApiResponse(200, payment, "Payment details"));
});

export { CreatePaymentId, ValidatePayment, GetPaymentHistory };
