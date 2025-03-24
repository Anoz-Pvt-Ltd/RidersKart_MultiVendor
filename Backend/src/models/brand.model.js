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
    subcategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
        validate: {
          validator: async (v) => await Brand.find({ subcategory: v }).countDocuments() < 5,
          message: "Maximum 5 subcategories can be associated with a brand",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
