import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },

  price: {
    MRP: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    discountedPrice: {
      type: Number,
      min: 0,
      get: function () {
        if (!this.MRP) return 0;
        const d = this.discount || 0;
        return this.MRP - (this.MRP * d) / 100;
      },
      set: function (value) {
        this.discountedPrice = value;
      },
    },
  },

  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, required: true, unique: true },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorUser",
    required: true,
  },

  images: [
    {
      fileId: { type: String, required: true },
      url: { type: String, required: true },
      altText: { type: String, default: "" },
    },
  ],

  specifications: {
    type: Map,
    of: String,
    default: {},
  },

  tags: { type: [String], default: [] },

  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "inactive",
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  deliveryScope: {
    type: String,
    enum: ["all", "state", "city"],
    default: "all",
  },

  deliveryStates: { type: [String], default: [] },

  deliveryCities: { type: [String], default: [] },

  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      product: { type: String },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  featured: {
    type: String,
    enum: ["featured", "non-featured", "suspended"],
    default: "non-featured",
  },

  productDimensions: { type: String, trim: true, default: "" },
  productWeight: { type: String, trim: true, default: "" },

  commission: {
    percentage: { type: String, default: "" },
    amount: { type: String, default: "" },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Product = mongoose.model("Product", productSchema);
