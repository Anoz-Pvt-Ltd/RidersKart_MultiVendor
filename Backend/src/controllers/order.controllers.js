import mongoose from "mongoose";
import { Order } from "../models/order.models.js";
import { Product } from "../models/products.models.js";
import { VendorUser } from "../models/vendorUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import SendMail from "../utils/Nodemailer.js";
import { OrderConformation } from "../utils/Email_UI/Register_ui.js";

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

  // console.log("from controller", [userId, products, totalAmount]);

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
    // console.log("item.product: ", item.product);
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

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found!");

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

const GetVendorOrders = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  // Find all orders where the vendor matches the provided ID
  const orders = await Order.aggregate([
    // Unwind the products array to deal with each item individually
    {
      $unwind: "$products",
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          orderStatus: {
            $not: {
              $eq: "pending",
            },
          },
        },
    },
    // Lookup to populate the product field
    {
      $lookup: {
        from: "products",
        // collection name in MongoDB
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    // Get single object from array
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
        user: {
          $first: "$user",
        },
        createdAt: {
          $first: "$createdAt",
        },
        updatedAt: {
          $first: "$updatedAt",
        },
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
    {
      $sort: {
        createdAt: -1,
      },
    },
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

  const orders = await Order.find({
    user: userId,
    orderStatus: "confirmed",
  }).populate("products.product");

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
      $unwind: {
        path: "$products",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: {
        path: "$productDetails",
      },
    },
    {
      $match: {
        $expr: {
          $eq: [
            "$productDetails.vendor",
            new mongoose.Types.ObjectId(vendorId),
          ],
        },
      },
    },
    {
      $lookup: {
        from: "vendorusers",
        localField: "productDetails.vendor",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $unwind: {
        path: "$vendor",
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        updatedAt: { $first: "$updatedAt" },
        products: {
          $push: {
            product: "$productDetails",
            quantity: "$products.quantity",
            price: "$products.price",
          },
        },
        orderStatus: { $first: "$orderStatus" },
        paymentStatus: { $first: "$paymentStatus" },
        paymentMethod: { $first: "$paymentMethod" },
        vendor: { $first: "$vendor" },
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);

  // console.log(orders);
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
    // const orders = await Order.find({ orderStatus: "confirmed" });
    const orders = await Order.find();
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
    const order = await Order.findById({ _id: orderId }).populate(
      "products.product"
    );
    if (!order) throw new ApiError(405, "Order not found!");

    res.json(new ApiResponse(200, { order }, "Order fetched successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status, address } = req.body;
  // console.log("Order Address -------------------", address);
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

  const user = await User.findById(order.user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  order.orderStatus = status;
  order.shippingAddress = address; // Update shipping address if provided
  await order.save();

  // TODO: If I instantly bought some product using buy now then my carts will be cleared!
  // thats a problem
  user.CartProducts = [];
  await user.save();

  // this address is for sending user from mail.
  const UserAddress = [
    `${address.street}, ${address.city}`,
    `${address.state}, ${address.country}`,
    `${address.pinCode}`,
  ];

  // Finding products for sending user via mail
  const orderedProducts = await Promise.all(
    order.products.map(async (item) => {
      const product = await Product.findById(item.product, {
        name: 1,
        images: { $slice: 1 },
      });

      if (!product) return null; // Skip if the product is not found

      return {
        name: product.name,
        image: product.images[0] || "", // Handle empty image array
        quantity: item.quantity,
      };
    })
  );

  const OrderConformationEmailBody = OrderConformation(
    user.name,
    order._id,
    UserAddress,
    orderedProducts
  );

  // Send email to user about the order
  if (status === "pending")
    await SendMail(
      user.email,
      "Order placed successfully",
      "Order Conformation",
      OrderConformationEmailBody
    );
  else
    await SendMail(
      user.email,
      "Your Order Status",
      `Order ${status}`,
      OrderConformationEmailBody
    );

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

const allCashOnDeliveryOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    paymentMethod: "cash",
    orderStatus: "confirmed",
  });
  if (!orders || orders.length === 0) {
    return res
      .status(404)
      .json({ message: "No cash on delivery orders found" });
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

const getVendorsOrderReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  const orders = await Order.aggregate([
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          orderStatus: {
            $not: {
              $eq: "pending",
            },
          },
        },
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          updatedAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
        },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productsDetails",
        },
    },
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$productsDetails",
        },
    },
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: "$productsDetails.vendor",
          Orders: {
            $push: "$$ROOT",
          },
        },
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "vendorusers",
          localField: "_id",
          foreignField: "_id",
          as: "vendorDetails",
        },
    },
    {
      $addFields:
        /**
         * newField: The new field name.
         * expression: The new field expression.
         */
        {
          totalPayableAmount: {
            $sum: "$Orders.productsDetails.price.sellingPrice",
          },
        },
    },
  ]);

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found for this user" });
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

const markOrderAsConfirm = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  order.orderStatus = "confirmed";
  await order.save();
  res.json(new ApiResponse(200, order, "Order marked as Confirm"));
});
const markOrderAsShipped = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  order.orderStatus = "shipped";
  await order.save();
  res.json(new ApiResponse(200, order, "Order marked as Shipped"));
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
  allCashOnDeliveryOrders,
  getVendorsOrderReport,
  markOrderAsConfirm,
  markOrderAsShipped,
};

//fetch data fn in utils; set domain url;
