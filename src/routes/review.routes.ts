import express from "express";
import { protect, restrictTO } from "../controllers/auth.controller";
import {
  checkOwnershipReview,
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setIDs,
  updateReview,
} from "../controllers/review.controller";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator";
import { validateRequest } from "../validators/validate";

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
    checkOwnershipReview,
    validateRequest(updateReviewSchema),
    updateReview
  )
  .delete(restrictTO("user", "admin"), deleteReview);
export default router;
