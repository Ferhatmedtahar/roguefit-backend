import express from "express";
import { protect, restrictTO } from "../controllers/auth.controller";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setIDs,
  updateReview,
} from "../controllers/review.controller";

const router = express.Router({ mergeParams: true });
router.use(protect);
router
  .route("/")
  .get(getAllReviews)
  .post(restrictTO("user"), setIDs, createReview);
router
  .route("/:reviewId")
  .get(getReview)
  .patch(restrictTO("user", "admin"), updateReview)
  .delete(restrictTO("user", "admin"), deleteReview);
export default router;
