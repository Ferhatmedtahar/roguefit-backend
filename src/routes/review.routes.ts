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
import { validateRequest } from "../validators/validate";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator";

const router = express.Router({ mergeParams: true });
router.use(protect);
router
  .route("/")
  .get(getAllReviews)
  .post(
    restrictTO("user"),
    setIDs,
    validateRequest(createReviewSchema),
    createReview
  );
router
  .route("/:reviewId")
  .get(getReview)
  .patch(
    restrictTO("user", "admin"),
    validateRequest(updateReviewSchema),
    updateReview
  )
  .delete(restrictTO("user", "admin"), deleteReview);
export default router;
