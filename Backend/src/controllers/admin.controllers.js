import { Admin } from "../models/admin.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    return { AccessToken, RefreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email is already in use");
  }

  const newUser = await Admin.create({
    name,
    email,
    phoneNumber,
    password,
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

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(401, "email and password are required");

  const user = await Admin.findOne({ email });

  if (!user) throw new ApiError(404, "Provided email is not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiError(401, "Entered Password is not correct");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user?._id
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
        "User Logged In successfully"
      )
    );
});

const regenerateRefreshToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.RefreshToken || req.body.RefreshToken;

    if (!token) throw new ApiError(401, "Unauthorized request");
    // console.log("Hello from ", token);
    // console.log(token, process.env.REFRESH_TOKEN_SECRET);

    const DecodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(DecodedToken);

    const user = await Admin.findById(DecodedToken._id).select(
      "-password -refreshToken"
    );

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

export { registerAdmin, loginAdmin, regenerateRefreshToken };
