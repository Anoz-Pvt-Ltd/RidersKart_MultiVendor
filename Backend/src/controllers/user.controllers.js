// import { User } from "./user_model";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.models.js";
import { Order } from "../models/order.models.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(401, "email and password are required");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "Provided email is not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiError(401, "Entered Credential is not correct");

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
    // console.log("Hello from ", token);
    // console.log(token, process.env.REFRESH_TOKEN_SECRET);

    const DecodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(DecodedToken);

    const user = await User.findById(DecodedToken._id).select(
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

const addProductToCart = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { productId } = req.params; // Get productId from the request body

  try {
    // Find the user and populate CartProducts
    const user = await User.findById(userId).populate("CartProducts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the user's cart
    if (user.CartProducts.some((item) => item._id.toString() === productId)) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    // Add the product to the user's cart
    user.CartProducts.push(productId);

    // Save the user document
    await user.save();

    return res.status(200).json({ message: "Product added to cart", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

const getCartProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter

  try {
    // Find the user and populate the CartProducts field
    const user = await User.findById(userId).populate("CartProducts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the cart products
    return res.status(200).json({ success: true, data: user.CartProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Controller to remove a product from the user's cart
const removeProductFromCart = async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { productId } = req.body; // Get productId from the request body

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product is in the user's cart
    if (!user.products.includes(productId)) {
      return res.status(400).json({ message: "Product not in cart" });
    }

    // Remove the product from the user's cart
    user.products = user.products.filter(
      (product) => product.toString() !== productId
    );

    // Save the user document
    await user.save();

    return res.status(200).json({ message: "Product removed from cart", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to update product quantity in the cart (optional)
const updateProductQuantityInCart = async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { productId, quantity } = req.body; // Get productId and quantity from the request body

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is in the cart
    const productIndex = user.products.indexOf(productId);

    if (productIndex === -1) {
      return res.status(400).json({ message: "Product not in cart" });
    }

    return res.status(200).json({ message: "Product quantity updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const bookProduct = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { productId, quantity } = req.body; // Get productId and quantity from the request body

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check product availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Reduce product stock
    product.stockQuantity -= quantity;
    await product.save();

    // Create an order
    const order = new Order({
      user: userId,
      product: productId,
      quantity,
      status: "booked",
      totalPrice: product.price * quantity,
    });

    await order.save();

    return res
      .status(201)
      .json({ success: true, message: "Product booked successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export {
  registerUser,
  loginUser,
  deleteUser,
  updateAddress,
  regenerateRefreshToken,
  addProductToCart,
  getCartProducts,
  removeProductFromCart,
  updateProductQuantityInCart,
  bookProduct,
};
