import { Order } from "../models/order.models.js";
import { Product } from "../models/products.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CreateOrder = asyncHandler(async (req, res) => {
  const { userId, vendorId, products, shippingAddress } = req.body;

  if (
    !userId ||
    !vendorId ||
    !products ||
    products.length === 0 ||
    !shippingAddress
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate product availability and calculate total amount
  let totalAmount = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }
    if (product.stockQuantity < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for product: ${product.name}`
      );
    }
    totalAmount += product.price * item.quantity;

    // Reduce stock quantity
    product.stockQuantity -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: userId,
    vendor: vendorId,
    products,
    totalAmount,
    shippingAddress,
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
  const orders = await Order.find({ vendor: vendorId })
    .populate("user", "name email") // Populating user details
    .populate("products.product", "name price") // Populating product details
    .exec();

  if (orders.length === 0) {
    throw new ApiError(404, "No orders found for this vendor");
  }

  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

export { CreateOrder, CancelOrder, GetVendorOrders };
