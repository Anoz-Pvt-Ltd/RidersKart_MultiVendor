import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  regenerateRefreshToken,
  addProductToCart,
  removeProductFromCart,
  getCartProducts,
  addAddress,
  editAddress,
  deleteAddress,
  deleteUser,
  addProductToWishlist,
  getWishlistProducts,
  getUserAddresses,
  editUserDetails,
  getAllUsers,
  getCurrentUser,
  AdminGetUserAddresses,
  UserBan,
  removeProductFromWishlist,
  EditProductQuantity,
  //   getUserProfile,
} from "../controllers/user.controllers.js";

const router = Router();

// Public routes (no authentication)
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Private routes (require authentication)
router.route("/re-login").post(VerifyUser, regenerateRefreshToken);
router.route("/:userId/:productId/cart/add").post(VerifyUser, addProductToCart);
router
  .route("/:userId/:productId/cart/remove")
  .delete(VerifyUser, removeProductFromCart);
router
  .route("/:productId/cart/edit-quantity")
  .post(VerifyUser, EditProductQuantity);

router
  .route("/:userId/:productId/wishlist/add")
  .post(VerifyUser, addProductToWishlist);
router
  .route("/:userId/:productId/wishlist/remove")
  .post(VerifyUser, removeProductFromWishlist);
router.route("/:userId/cart-products").get(VerifyUser, getCartProducts);
router.route("/:userId/wishlist-products").get(VerifyUser, getWishlistProducts);

//modification routes
router.route("/:userId/addresses").post(VerifyUser, addAddress);
router.route("/:userId/addresses").get(VerifyUser, getUserAddresses);
router.route("/:userId/addresses/:addressId").put(VerifyUser, editAddress);
router.route("/:userId/addresses/:addressId").delete(VerifyUser, deleteAddress);
router.route("/edit-user-profile/:userId").post(VerifyUser, editUserDetails);
// router.route("/user-profile/:userId").get(getUserProfile);

//routes for admin usage
router.route("/admin/get-all-users").get(getAllUsers);
router.route("/admin/get-current-user/:userId").get(getCurrentUser);
router.route("/admin/:userId/addresses").get(AdminGetUserAddresses);
router.route("/admin/ban-user/:userId").post(UserBan);

//routes to be handled securely
router.route("/delete-user-profile").delete(deleteUser);

export default router;
