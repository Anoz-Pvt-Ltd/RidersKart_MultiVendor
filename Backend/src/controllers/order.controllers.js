import mongoose from "mongoose";
import { Order } from "../models/order.models.js";
import { Product } from "../models/products.models.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CreateOrder = asyncHandler(async (req, res) => {
  const { userId, products, totalAmount } = req.body;

  // structure of products (array of objects representing each product with its quantity and price details)
  // products: [
  //   {
  //     product: "productId",
  //     quantity: 2,
  //     price: {
  //       MRP: 100,
  //       sellingPrice: 80,
  //       discount: 20,
  //     },
  //   },
  //   {
  //     product: "productId",
  //     quantity: 2,
  //     price: {
  //       MRP: 100,
  //       sellingPrice: 80,
  //       discount: 20,
  //     },
  //   },
  //   //... more products
  // ];

  console.log("from controller", [userId, products, totalAmount]);

  if (
    !userId ||
    !products ||
    products.length === 0 ||
    // !shippingAddress ||
    !totalAmount
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  // Verify that all product IDs are valid and available
  for (const item of products) {
    console.log("item.product: ", item.product);
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }
    if (product.stockQuantity <= 0) {
      throw new ApiError(
        400,
        `Product with ID ${item.product} is out of stock`
      );
    } else {
      // Reduce stock quantity before creating the order
      product.stockQuantity -= item.quantity;
      await product.save();
    }
  }

  const order = await Order.create({
    user: userId,
    products,
    totalAmount,
    // shippingAddress,
  });

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// Controller to cancel an existing order
const CancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Only allow cancellation if the order is still pending
  if (order.orderStatus !== "pending") {
    throw new ApiError(400, "Order cannot be canceled at this stage");
  }

  // Restore product stock quantities
  for (const item of order.products) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stockQuantity += item.quantity;
      await product.save();
    }
  }

  order.orderStatus = "cancelled";
  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order canceled successfully"));
});

const GetVendorOrders = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  // Find all orders where the vendor matches the provided ID
    const orders = await Order.aggregate([
      // Unwind the products array to deal with each item individually
      { $unwind: "$products" },

      // Lookup to populate the product field
      {
        $lookup: {
          from: "products", // collection name in MongoDB
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Get single object from array

      // Match only products belonging to the specified vendor
      {
        $match: {
          "productDetails.vendor": vendorId,
        },
      },

      // Optionally group back to reconstruct orders if needed
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          products: {
            $push: {
              product: "$productDetails",
              quantity: "$products.quantity",
              price: "$products.price",
            },
          },
        },
      },

      // Optional: sort orders
      { $sort: { createdAt: -1 } },
    ]);

  if (orders.length === 0) {
    throw new ApiError(404, "No orders found for this vendor");
  }

  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

// Controller to fetch all orders for a specific user
const getUserAllOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const orders = await Order.find({ user: userId }).populate(
    "products.product"
  );

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this user" });
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

const getVendorAllOrders = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    return res.status(400).json({ message: "Vendor ID is required" });
  }

  const vendor = await VendorUser.findById(vendorId);
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  // Fetch all orders for the specified user
 const orders = await Order.aggregate([
   {
     $lookup: {
       from: "products",
       localField: "products.product",
       foreignField: "_id",
       as: "productDetails",
     },
   },
   {
     $match: {
       "productDetails.vendor": vendorId,
     },
   },
   {
     $unwind: "$products",
   },
   {
     $lookup: {
       from: "products",
       localField: "products.product",
       foreignField: "_id",
       as: "products.productDetails",
     },
   },
   {
     $match: {
       "products.productDetails.vendor": vendorId,
     },
   },
   {
     $group: {
       _id: "$_id",
       orderData: { $first: "$$ROOT" },
     },
   },
 ]);

  console.log(orders);

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this user" });
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  // const { orderId } = req.body;
  try {
    const orders = await Order.find({});
    res.json(
      new ApiResponse(200, { orders }, "All users fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

const getCurrentOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const orders = await Order.findById({ _id: orderId });
    res.json(
      new ApiResponse(200, { orders }, "All users fetched successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status, address } = req.body;
  if (!orderId || !status) {
    throw new ApiError(400, "Missing required fields");
  }
  if (
    ![
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "booked",
    ].includes(status)
  ) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.orderStatus = status;
  order.shippingAddress = address; // Update shipping address if provided
  await order.save();

  res.json(new ApiResponse(200, order, "Order status updated successfully"));
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status) {
    throw new ApiError(400, "Missing required fields");
  }
  if (!["pending", "completed", "failed", "refunded"].includes(status)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = status;
  await order.save();

  res.json(new ApiResponse(200, order, "Payment status updated successfully"));
});

export {
  CreateOrder,
  CancelOrder,
  GetVendorOrders,
  getUserAllOrders,
  getVendorAllOrders,
  getAllOrders,
  getCurrentOrder,
  updateOrderStatus,
  updatePaymentStatus,
};

//fetch data fn in utils; set domain url;
