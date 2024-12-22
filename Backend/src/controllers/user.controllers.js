// import { User } from "./user_model";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper function to generate access and refresh tokens
const generateAccessAndRefreshTokens = (userId) => {
  const AccessToken = Jwt.sign(
    { _id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const RefreshToken = Jwt.sign(
    { _id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { AccessToken, RefreshToken };
};

// Controller: Register a new user
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phoneNumber, password, address } = req.body;

  if (!name || !email || !phoneNumber || !password || !address) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email is already in use");
  }

  const newUser = await User.create({
    name,
    email,
    phoneNumber,
    password,
    address,
  });
  const token = newUser.generateAccessToken();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: newUser, token },
        "User registered successfully"
      )
    );
});

// Controller: Login a user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = user.generateAccessToken();

  res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

// Controller: Delete a user
const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

// Controller: Update user address
const updateAddress = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { address } = req.body;

  if (!address) {
    throw new ApiError(400, "Address is required");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { address, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address updated successfully"));
});

// Controller: Regenerate refresh token
const regenerateRefreshToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.RefreshToken || req.body.RefreshToken;

    if (!token) throw new ApiError(401, "Unauthorized request");

    const DecodedToken = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(DecodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(400, "Invalid Token");

    const { RefreshToken, AccessToken } = generateAccessAndRefreshTokens(
      user._id
    );

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

export {
  registerUser,
  loginUser,
  deleteUser,
  updateAddress,
  regenerateRefreshToken,
};
