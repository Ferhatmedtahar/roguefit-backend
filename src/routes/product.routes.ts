import express from "express";

import { protect, restrictTO } from "../controllers/auth.controller";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  resizeProductImages,
  updateProduct,
  uploadProductImages,
} from "../controllers/product.controller";

import {
  checkProductSchema,
  updateProductSchema,
} from "../validators/product.validator";
import { validateRequest } from "../validators/validate";
import reviewRouter from "./review.routes";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    restrictTO("admin", "seller"),
    uploadProductImages,
    resizeProductImages,
    validateRequest(checkProductSchema),
    createProduct
  );
router
  .route("/:id")
  .patch(
    protect,
    restrictTO("admin", "seller"),
    uploadProductImages,
    resizeProductImages,
    validateRequest(updateProductSchema),
    updateProduct
  )
  .delete(protect, restrictTO("admin", "seller"), deleteProduct)
  .get(getProduct);

router.use("/:productId/reviews", reviewRouter);

// router
//   .route("/:productId/reviews")
//   .post(protect, restrictTO("user"), createReview);

export default router;
