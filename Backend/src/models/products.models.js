import mongoose from "mongoose";
import { categories } from "../utils/constants.js";

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
    main: {
      type: String,
      required: true,
      enum: categories.map((cat) => cat.title),
    },
    sub: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const mainCategory = this.category.main;
          const categoryData = categories.find(
            (cat) => cat.title === mainCategory
          );
          return categoryData ? categoryData.items.includes(value) : false;
        },
        message: "Invalid subcategory for the selected main category.",
      },
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
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
