import mongoose, { Schema } from "mongoose";
// import { User } from "./user.model";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  price: {
    MRP: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100, // Maximum discount percentage allowed
    },
    discountedPrice: {
      type: Number,
      // required: true,
      min: 0, // Calculated discounted price based on MRP and discount percentage
      get: function () {
        return this.MRP - (this.MRP * this.discount) / 100;
      },
      set: function (value) {
        this.discountedPrice = value;
      },
    },
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true, // Stock Keeping Unit for unique product identification
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorUser", // Reference to the vendor who registered the product
    required: true,
  },
  images: [
    {
      fileId: {
        type: String, // ImageKit file ID
        required: true, // The unique identifier for the uploaded image file
      },
      url: {
        type: String,
        required: true,
      },
      altText: {
        type: String,
        default: "",
      },
    },
  ],
  specifications: {
    type: Map,
    of: String, // Key-value pair for product specifications (e.g., "Color": "Red", "Size": "Large")
    default: {},
  },
  tags: {
    type: [String],
    default: [], // Optional tags for search and categorization
  },
  status: {
    type: String,
    enum: ["active", "inactive", "out-of-stock"],
    default: "active",
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  deliveryScope: {
    type: String,
    enum: ["all", "state", "city"],
    // required: true,
  },
  deliveryStates: {
    type: [String], // e.g. ["BIHAR", "JHARKHAND"]
    default: [],
  },
  deliveryCities: {
    type: [String], // e.g. ["PATNA", "NALANDA"]
    default: [],
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      product: {
        type: String,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "inactive",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` timestamp before saving
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Product = mongoose.model("Product", productSchema);
