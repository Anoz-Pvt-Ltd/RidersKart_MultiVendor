import mongoose, { Schema } from "mongoose";

const productPolicySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    policy: {
      type: String,
      required: true,
    },
    termsAndConditions: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    shortSummary: {
      type: String,
      trim: true,
    },
    policyType: {
      type: String,
      enum: ["return", "warranty", "shipping", "refund", "general"],
      required: true,
    },

    policyFor: {
      type: String,
      enum: ["product", "category", "brand", "all"],
      default: "all",
      required: true,
    },

    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    subcategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: [
      {
        type: Schema.Types.ObjectId,
        ref: "Brand",
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    appliesToAllCategories: {
      type: Boolean,
      default: false,
    },
    appliesToAllSubcategories: {
      type: Boolean,
      default: false,
    },
    appliesToAllBrands: {
      type: Boolean,
      default: false,
    },
    effectiveDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    //     priority: {
    //       type: Number,
    //       default: 0,
    //     },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    //     attachments: [
    //       {
    //         url: String,
    //         name: String,
    //         type: String,
    //       },
    //     ],

    region: {
      type: String,
      enum: ["global", "country", "state", "city"],
      default: "global",
    },
    country: String,
    state: String,
    city: String,
    language: {
      type: String,
      default: "en",
    },
    version: {
      type: Number,
      default: 1,
    },
    displayOnWebsite: {
      type: Boolean,
      default: true,
    },
    displayInCheckout: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ProductPolicy = mongoose.model(
  "ProductPolicy",
  productPolicySchema
);
