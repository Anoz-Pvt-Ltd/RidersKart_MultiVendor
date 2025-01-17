import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { Product } from "../models/products.models.js";
import jwt from "jsonwebtoken";

const registerVendor = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    contactNumber,
    location = {}, // Default to an empty object to avoid destructuring issues
    gstNumber,
    businessName,
    accountHolderName,
    accountNumber,
    bankName,
    ifscCode,
    password,
  } = req.body;

  const { address, city, state, country, postalCode } = location;
  // console.log(req.body);
  // Validate input (all required fields, including nested location fields)
  if (
    !name ||
    !email ||
    !contactNumber ||
    !address ||
    !city ||
    !state ||
    !country ||
    !postalCode ||
    !gstNumber ||
    !businessName ||
    !accountHolderName ||
    !accountNumber ||
    !bankName ||
    !ifscCode ||
    !password
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check if vendor already exists by email
  const existingVendor = await VendorUser.findOne({ email });
  if (existingVendor) {
    return next(new ApiError(400, "A vendor with this email already exists"));
  }

  // Create new vendor instance
  const newVendor = new VendorUser({
    name,
    email,
    contactNumber,
    location: {
      address,
      city,
      state,
      country,
      postalCode,
    },
    businessDetails: {
      gstNumber,
      businessName,
    },
    bankDetails: {
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
    },
    password, // Password will be hashed in the pre-save middleware
  });

  // Save the vendor to the database
  await newVendor.save();

  // Generate access and refresh tokens
  const accessToken = newVendor.generateAccessToken();
  const refreshToken = newVendor.generateRefreshToken();

  // Return success response
  const response = new ApiResponse(201, {
    vendor: {
      id: newVendor._id,
      name: newVendor.name,
      email: newVendor.email,
      contactNumber: newVendor.contactNumber,
      location: newVendor.location,
      status: newVendor.status,
      createdAt: newVendor.createdAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });

  res.status(response.statusCode).json(response);
});

const loginVendor = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  // Check if vendor exists
  const vendor = await VendorUser.findOne({ email });
  if (!vendor) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  // Check if the password is correct
  const isPasswordValid = await vendor.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  // Generate access and refresh tokens
  const accessToken = vendor.generateAccessToken();
  const refreshToken = vendor.generateRefreshToken();

  // Return success response
  const response = new ApiResponse(200, {
    vendor: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      contactNumber: vendor.contactNumber,
      location: vendor.location,
      status: vendor.status,
      createdAt: vendor.createdAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });

  res.status(response.statusCode).json(response);
});

const getVendorData = asyncHandler(async (req, res, next) => {
  const vendorId = req.user._id; // Assumes vendor's ID is available from authentication middleware

  // Fetch vendor profile
  const vendor = await VendorUser.findById(vendorId);

  if (!vendor) {
    return next(new ApiError(404, "Vendor not found"));
  }

  // Fetch products associated with the vendor
  const products = await Product.find({ vendor: vendorId });

  // Prepare and send response
  const response = new ApiResponse(200, {
    vendor: {
      name: vendor.name,
      email: vendor.email,
      contactNumber: vendor.contactNumber || "",
      businessName: vendor.businessName || "",
      address: vendor.address || "",
    },
    products,
  });

  res.status(response.statusCode).json(response);
});

const regenerateRefreshToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.RefreshToken || req.body.RefreshToken;

    if (!token) throw new ApiError(401, "Unauthorized request");

    console.log(token, process.env.REFRESH_TOKEN_SECRET);

    const DecodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await VendorUser.findById(DecodedToken._id).select(
      "-password -refreshToken"
    );
    console.log(user);

    if (!user) throw new ApiError(400, "Invalid Token");

    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .cookie("RefreshToken", RefreshToken, options)
      .cookie("AccessToken", AccessToken, options)
      .json(
        new ApiResponse(
          201,
          {
            user,
            tokens: {
              AccessToken,
              RefreshToken,
            },
          },
          "Refresh token regenerated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Token");
  }
});

const editVendor = asyncHandler(async (req, res, next) => {
  const { vendorId } = req.params;
  const updateData = req.body;

  const vendor = await VendorUser.findById(vendorId);

  if (!vendor) {
    throw new ApiError(404, `Vendor with ID ${vendorId} not found`);
  }

  Object.assign(vendor, updateData);
  vendor.updatedAt = Date.now();

  await vendor.save();

  res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor updated successfully"));
});

const deleteVendor = asyncHandler(async (req, res, next) => {
  const { vendorId } = req.params;

  const vendor = await VendorUser.findByIdAndDelete(vendorId);

  if (!vendor) {
    throw new ApiError(404, `Vendor with ID ${vendorId} not found`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Vendor deleted successfully"));
});

const getVendorDetailsByProductId = async (req, res) => {
  const { productId } = req.params;
  // console.log("controller reached", productId);

  try {
    // Find the product and populate the vendor details
    const product = await Product.findById(productId).populate("vendor");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Send the vendor details in the response
    const vendorDetails = product.vendor;
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          vendorDetails,
          "Vendor details fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
  }
};

const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const vendors = await VendorUser.find({});
    res.json(
      new ApiResponse(200, { vendors }, "All vendors fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
});

const getCurrentVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  try {
    const vendor = await VendorUser.findById(vendorId);
    if (!vendor) {
      throw new ApiError(404, "vendor not found");
    }
    res.json(new ApiResponse(200, { vendor }, "vendor fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
});

const VendorBan = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const vendor = await VendorUser.findById(vendorId);
  if (!vendor) throw new ApiError(404, "vendor not found");

  vendor.isBanned = !vendor.isBanned;
  vendor.save();
  res.status(200).json(new ApiResponse(200, vendor, "vendor status updated"));
});

export {
  registerVendor,
  loginVendor,
  getVendorData,
  regenerateRefreshToken,
  editVendor,
  deleteVendor,
  getVendorDetailsByProductId,
  getAllVendors,
  getCurrentVendor,
  VendorBan,
};
