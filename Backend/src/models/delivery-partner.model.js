import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const deliveryPartnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    drivingLicense: {
      number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      image: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
      },
    },
    aadhar: {
      number: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
      },
      image: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
      },
    },
    pan: {
      number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      image: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
      },
    },
    physicallyDisabled: {
      type: Boolean,
      required: true,
    },

    // Vehicle Details

    vehicleDetails: {
      vehicleType: {
        type: String,
        required: true,
      },
      plateNumber: {
        type: String,
        required: true,
      },
      vehicleDescription: {
        type: String,
        required: true,
      },
      RAC: {
        front: {
          url: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          },
        },
        back: {
          url: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          },
        },
      },
      insurance: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
      },
      insurance: {
        number: {
          type: String,
          required: true,
          unique: true,
        },
        expiry: {
          type: Date,
          required: true,
        },
        image: {
          url: {
            type: String,
            required: true,
          },
          fileId: {
            type: String,
            required: true,
          },
        },
      },
      pollution: {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
      },
    },

    // Additional Information

    allOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    socketId: { type: String, default: null },

    allPayments: [
      {
        type: Schema.Types.ObjectId,
        ref: "paymentTransaction",
      },
    ],

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "banned", "suspended"],
      default: "pending",
    },

    activeOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    rating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },

    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "VendorUser",
      required: true,
    },

    // allReviews: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Review",
    //   },
    // ],
  },
  { timestamps: true }
);

deliveryPartnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

deliveryPartnerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

deliveryPartnerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
deliveryPartnerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);
