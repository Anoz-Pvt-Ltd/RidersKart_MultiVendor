import { Router } from "express";
import {
  createPromotion,
  deletePromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
} from "../controllers/promotion.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyAdminUser } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllPromotions)
  .post(VerifyAdminUser, upload.array("images", 3), createPromotion);

router
  .route("/promotion/:id")
  .get(getPromotionById)
  .delete(VerifyAdminUser, deletePromotion)
  .patch(VerifyAdminUser, updatePromotion);

export default router;
