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
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
