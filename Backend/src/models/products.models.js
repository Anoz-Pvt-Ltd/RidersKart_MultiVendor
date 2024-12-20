import mongoose from "mongoose";

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
    type: String,
    required: true,
    enum: [
      "Electronics",
      "Clothing",
      "Home & Kitchen",
      "Beauty",
      "Health",
      "Books",
      "Toys",
      "Sports",
      "Automotive",
    ],
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
