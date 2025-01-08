import { Router } from "express";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  regenerateRefreshToken,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantityInCart,
  getCartProducts,
  bookProduct,
  //   getUserProfile,
  //   editUserProfile,
  //   deleteUserProfile,
} from "../controllers/user.controllers.js";

const router = Router();

// Public routes (no authentication)
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Private routes (require authentication)
router.route("/re-login").post(VerifyUser, regenerateRefreshToken);
router.route("/:userId/:productId/cart/add").post(VerifyUser, addProductToCart);
router.route("/:userId/cart-products").get(VerifyUser, getCartProducts);
router.route("/:userId/cart/remove").delete(VerifyUser, removeProductFromCart);
router
  .route("/:userId/cart/update")
  .post(VerifyUser, updateProductQuantityInCart);

router.route("/users/:userId/book-products").post(VerifyUser, bookProduct);
// router.route("/user-profile/:userId").get(getUserProfile);
// router.route("/edit-user-profile").post(editUserProfile);
// router.route("/delete-user-profile").post(deleteUserProfile);

export default router;
