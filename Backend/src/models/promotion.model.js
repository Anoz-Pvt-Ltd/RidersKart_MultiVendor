import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    required: true,
    enum: ["flat_discount", "percentage_discount", "buy_x_get_y"],
  },

  images: {
    url: {
      lg: { type: String, required: true },
      md: { type: String, required: true },
      sm: { type: String, required: true },
    },
    fileId: {
      lg: { type: String, required: true },
      md: { type: String, required: true },
      sm: { type: String, required: true },
    },
  },

  discountValue: { type: Number, required: true },
  minPurchaseAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number },

  applicableCategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  ],
  applicableSubcategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
  ],

  couponCode: { type: String, unique: true, sparse: true },
  usageLimit: { type: Number, default: 1 },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    default: "active",
    enum: ["active", "expired", "upcoming"],
  },

  userEligibility: {
    type: String,
    default: "all",
    enum: ["all", "new_users", "specific_users"],
  },
  applicableUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  maxUsagePerUser: { type: Number, default: 1 },
});

export const Promotion = mongoose.model("Promotion", PromotionSchema);
