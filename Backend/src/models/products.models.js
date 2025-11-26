import mongoose, { Schema } from "mongoose";

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
      max: 100,
    },
    discountedPrice: {
      type: Number,
      min: 0,
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
    unique: true,
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorUser",
    required: true,
  },

  images: [
    {
      fileId: {
        type: String,
        required: true,
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
    of: String,
    default: {},
  },

  tags: {
    type: [String],
    default: [],
  },

  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "inactive",
  },

  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  deliveryScope: {
    type: String,
    enum: ["all", "state", "city"],
  },

  deliveryStates: {
    type: [String],
    default: [],
  },

  deliveryCities: {
    type: [String],
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

  featured: {
    type: String,
    enum: ["featured", "non-featured", "suspended"],
    default: "non-featured",
  },

  // ➕ NEW FIELDS
  productDimensions: {
    type: String,
    trim: true,
    default: "",
  },

  productWeight: {
    type: String,
    trim: true,
    default: "",
  },

  commission: {
    percentage: { type: String },
    amount: { type: String },
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
