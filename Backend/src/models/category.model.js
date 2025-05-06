import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    status: {
      type: String,
      required: true,
      default: "under-review",
      enum: ["Verified", "under-review"],
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
