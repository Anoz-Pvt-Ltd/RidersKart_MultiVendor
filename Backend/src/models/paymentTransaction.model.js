import mongoose, { Schema } from "mongoose";

const paymentTransactionSchema = new Schema(
  {
    razorpay_payment_id: {
      type: String,
      required: true,
      unique: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const paymentTransaction = mongoose.model(
  "paymentTransaction",
  paymentTransactionSchema
);
