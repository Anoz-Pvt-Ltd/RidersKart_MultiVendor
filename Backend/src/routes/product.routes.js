import { Router } from "express";
import {
  registerProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct,
  getProductsOfVendor,
  getProductByCategory,
  getAllProductForAdmin,
  addStockQuantity,
  removeStockQuantity,
  AddProductImages,
  searchProducts,
  deleteProductsByVendor,
  productRating,
  checkUserProductRating,
} from "../controllers/product.controllers.js";
import {
  VerifyAdminUser,
  VerifyUser,
  VerifyVendorUser,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//routes without authorization (public)
router
  .route("/register-product/:vendorId")
  .post(VerifyVendorUser, upload.single("image"), registerProduct);
router.route("/get-all-products").get(getAllProducts);
router.route("/get-single-product/:productId").get(getProduct);

router.route("/search-product").get(searchProducts);

//routes with authorization (private)
router
  .route("/get-all-product-of-vendor/:vendorId")
  .get(VerifyVendorUser, getProductsOfVendor);
router
  .route("/add-stock-quantity/:productId")
  .post(VerifyVendorUser, addStockQuantity);
router
  .route("/remove-stock-quantity/:productId")
  .post(VerifyVendorUser, removeStockQuantity);
router
  .route("/get-all-product/:category/:subcategory/:userAddress")
  .get(getProductByCategory);
router.route("/edit-product/:id").post(VerifyVendorUser, editProduct);
router
  .route("/add-images/:productId")
  .patch(VerifyVendorUser, upload.array("images", 9), AddProductImages);
router
  .route("/delete-products/:productId")
  .delete(VerifyVendorUser, deleteProduct);
router.route("/rating/:productId/:userId").post(VerifyUser, productRating);
router
  .route("/rated-products/:productId/:userId")
  .get(VerifyUser, checkUserProductRating);

//routes for admin
router.route("/admin/get-all-products").get(VerifyAdminUser, getAllProducts);
router
  .route("/admin/delete-all-vendor-products/:vendorId")
  .post(VerifyAdminUser, deleteProductsByVendor);
router
  .route("/admin/get-all-products-admin")
  .get(VerifyAdminUser, getAllProductForAdmin);
router
  .route("/admin/get-single-product/:productId")
  .get(VerifyAdminUser, getProduct);
router
  .route("/admin/single-product/:productId")
  .delete(VerifyAdminUser, deleteProduct);

export default router;
