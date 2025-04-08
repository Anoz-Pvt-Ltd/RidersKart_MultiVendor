// import { User } from "./user_model";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.models.js";
import { Order } from "../models/order.models.js";
import bcrypt from "bcrypt";
import SendMail from "../utils/Nodemailer.js";
import { register_ui } from "../utils/Email_UI/Register_ui.js";
import { FetchData } from "../utils/Fetch_Ex_API.js";

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
  if (!newUser) throw new ApiError(500, "Internal server error");
  const { RefreshToken, AccessToken } = await generateAccessAndRefreshTokens(
    newUser._id
  );
  SendMail(
    email,
    "Welcome to our platform",
    "Hello, welcome to our platform!",
    register_ui
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: newUser, token: { RefreshToken, AccessToken } },
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

  if (!isValid) throw new ApiError(401, "Entered Password is not correct");

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user?._id
  );

  const response = await FetchData("order/", "get");
  console.log("console form login", response);

  // const mailSent = await SendMail();
  // console.log(mailSent);

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

const editUserDetails = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  // Get the user ID from the token
  // const userId = req.user._id;
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password needs to be updated
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update user fields (name, email, phoneNumber, address)
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Update the updatedAt timestamp
    user.updatedAt = Date.now();

    // Save the updated user to the database
    await user.save();

    return res.status(200).json({
      message: "User details updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.json(new ApiResponse(200, { user }, "User fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
});

// cart controllers------------------------------------
const addProductToCart = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { productId } = req.params; // Get productId from the request body

  try {
    // Find the user and populate CartProducts
    const user = await User.findById(userId).populate("CartProducts.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the user's cart
    if (
      user.CartProducts.some(
        (item) => item.product._id.toString() === productId
      )
    ) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    // Add the product to the user's cart
    user.CartProducts.push({ product: productId });

    // Save the user document
    await user.save();

    const updatedUser = await User.findById(user._id).populate("CartProducts");

    return res
      .status(200)
      .json({ message: "Product added to cart", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
const removeProductFromCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params; // Get userId from the URL parameter

  // Find the user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the product is in the user's cart
  if (
    !user.CartProducts.some(
      (item) => item.product && item.product.toString() === productId
    )
  ) {
    return res.status(400).json({ message: "Product not in cart" });
  }

  // Remove the product from the user's cart
  user.CartProducts = user.CartProducts.filter(
    (item) => item.product.toString() !== productId
  );
  // Save the user document
  await user.save();

  return res.status(200).json({ message: "Product removed from cart", user });
});
const EditProductQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params; // Get userId and productId from the URL parameters
  const { quantity } = req.body; // Get the quantity to increase from the request body

  if (!productId) throw new ApiError(404, "User ID or Product ID not found!");
  if (!quantity || quantity <= 0) throw new ApiError(400, "Invalid quantity!");

  const user = await User.findById(req.user._id).populate(
    "CartProducts.product"
  );
  if (!user) throw new ApiError(404, "User authentication failed");

  const productInCart = user.CartProducts.find(
    (item) => item.product._id.toString() === productId
  );

  if (!productInCart) throw new ApiError(404, "Product not found in cart");

  productInCart.quantity = quantity; // Increase the quantity
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.CartProducts,
        "Product quantity updated successfully"
      )
    );
});
const getCartProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter

  try {
    // Find the user and populate the CartProducts field
    const user = await User.findById(userId).populate("CartProducts.product");

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

// wishlist controllers------------------------------------
const addProductToWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { productId } = req.params; // Get productId from the request body

  try {
    // Find the user and populate CartProducts
    const user = await User.findById(userId).populate("WishList");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the user's cart
    if (user.WishList.some((item) => item._id.toString() === productId)) {
      return res.status(400).json({ message: "Product already in Wishlist" });
    }

    // Add the product to the user's cart
    user.WishList.push(productId);

    // Save the user document
    await user.save();

    return res.status(200).json({ message: "Product added to Wishlist", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params; // Get userId from the URL parameter

  // Find the user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the product is in the user's cart
  if (!user.WishList.includes(productId)) {
    return res.status(400).json({ message: "Product not in Wishlist" });
  }

  // Remove the product from the user's cart
  user.WishList = user.WishList.filter(
    (product) => product.toString() !== productId
  );

  // Save the user document
  await user.save();

  return res
    .status(200)
    .json({ message: "Product removed from Wishlist", user });
});
const getWishlistProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter

  try {
    // Find the user and populate the CartProducts field
    const user = await User.findById(userId).populate("WishList");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the cart products
    return res.status(200).json({ success: true, data: user.WishList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Order controller ------------------------------------
const bookProduct = asyncHandler(async (req, res) => {
  const { userId, productId, vendorId } = req.params;
  const { quantity, shippingAddress, orderStatus } = req.body;

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

    // Check if the product belongs to the vendor
    if (product.vendor.toString() !== vendorId) {
      return res
        .status(400)
        .json({ message: "Product does not belong to the specified vendor" });
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
      vendor: vendorId,
      products: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
      totalAmount: product.price * quantity,
      shippingAddress, // Ensure this field is provided in the request body
      orderStatus, // Ensure this is a valid enum value in the Order model
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Product booked successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Address controller ------------------------------------
// Controller to add a new address
const addAddress = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const newAddress = req.body;

  // console.log(newAddress, "address input");

  if (!newAddress || Object.keys(newAddress).length === 0) {
    throw new ApiError(400, "New address details are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.address.push(newAddress);
  await user.save();
  // console.log("user address");

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address added successfully"));
});
// Controller to edit an existing address
const editAddress = asyncHandler(async (req, res, next) => {
  const { userId, addressId } = req.params;
  const updatedAddress = req.body;

  if (!updatedAddress || Object.keys(updatedAddress).length === 0) {
    throw new ApiError(400, "Updated address details are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.address.id(addressId);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  Object.assign(address, updatedAddress);
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address updated successfully"));
});
// Controller to delete an address
const deleteAddress = asyncHandler(async (req, res, next) => {
  const { userId, addressId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = user.address.id(addressId);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  address.remove();
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address deleted successfully"));
});
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user in the database by their ID and return only the addresses field
    const user = await User.findById(userId).populate("address");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the addresses of the user
    res.status(200).json(user.address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const AdminGetUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user in the database by their ID and return only the addresses field
    const user = await User.findById(userId).populate("address");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the addresses of the user
    res.status(200).json(user.address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin controller ------------------------------------
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(new ApiResponse(200, { users }, "All users fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
});

const UserBan = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "user not found");

  user.isBanned = !user.isBanned;
  user.save();
  res.status(200).json(new ApiResponse(200, user, "User status updated"));
});

export {
  registerUser,
  loginUser,
  deleteUser,
  updateAddress,
  regenerateRefreshToken,
  addProductToCart,
  addProductToWishlist,
  getCartProducts,
  getWishlistProducts,
  removeProductFromCart,
  removeProductFromWishlist,
  EditProductQuantity,
  bookProduct,
  addAddress,
  getUserAddresses,
  AdminGetUserAddresses,
  editAddress,
  deleteAddress,
  editUserDetails,
  getAllUsers,
  getCurrentUser,
  UserBan,
};
