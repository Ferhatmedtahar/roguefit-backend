import express from "express";

import { protect, restrictTO } from "../controllers/auth.controller";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";

import reviewRouter from "./review.routes";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, restrictTO("admin", "seller"), createProduct);
router
  .route("/:id")
  .patch(protect, restrictTO("admin", "seller"), updateProduct)
  .delete(protect, restrictTO("admin", "seller"), deleteProduct)
  .get(getProduct);

router.use("/:productId/reviews", reviewRouter);

// router
//   .route("/:productId/reviews")
//   .post(protect, restrictTO("user"), createReview);

export default router;
