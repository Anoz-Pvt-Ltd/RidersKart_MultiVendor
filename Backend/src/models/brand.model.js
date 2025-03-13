import mongoose from "mongoose";
import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    title: { type: String, required: true },
    logo: {
      url: { type: String, required: true },
      fileId: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      default: "under-review",
      enum: ["verified", "under-review"],
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
