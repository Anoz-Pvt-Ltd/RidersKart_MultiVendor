import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // The user who placed the order
  },
  // vendor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "VendorUser",
  //   required: true, // The vendor fulfilling the order
  // },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, // Product details
      },
      quantity: {
        type: Number,
        required: true, // Quantity of the product in the order
        min: 1,
      },
      price: {
        // type: Number,
        // required: true, // Price at the time of order
        MRP: {
          type: String,
          required: true,
        },
        sellingPrice: {
          type: String,
          required: true,
        },
        discount: {
          type: String,
          required: true,
        },
      },
    },
  ],
  totalAmount: {
    type: Number,
    // Total cost of the order
  },
  orderStatus: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "booked",
    ], // Added "booked"
    default: "pending", // Current status of the order
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending", // Payment status
  },
  paymentMethod: {
    type: String,
    enum: ["online", "cash"],
    default: "cash",
  },
  shippingAddress: {
    street: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    postalCode: {
      type: String,
      // required: true,
    },
  },
  placedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the order was placed
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the order was last updated
  },
  bookingDate: {
    type: Date,
    default: Date.now, // Date when the booking was made
  },
  deliveryDate: {
    type: Date, // Expected delivery date
  },
  specialInstructions: {
    type: String, // Any special instructions for the order
  },
});

// Middleware to update the `updatedAt` timestamp before saving
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

orderSchema.plugin(mongooseAggregatePaginate);
export const Order = mongoose.model("Order", orderSchema);
