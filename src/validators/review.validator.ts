import Joi from "joi";

const contentRule = Joi.string().min(3).max(400).required().messages({
  "string.min": "Review content must be at least 3 characters long",
  "string.max": "Review content must be less than 400 characters long",
  "string.empty": "Review content is required",
});
const ratingRule = Joi.number().min(1).max(5).required().messages({
  "number.min": "Rating must be at least 1",
  "number.max": "Rating must be at most 5",
  "number.empty": "Rating is required",
});

export const createReviewSchema = Joi.object({
  product: Joi.string().required().messages({
    "string.empty": "Product ID is required",
  }),
  user: Joi.string().required().messages({
    "string.empty": "User ID is required",
  }),
  content: contentRule,
  rating: ratingRule,
});

// Schema for updating an existing review
export const updateReviewSchema = Joi.object({
  content: contentRule,
  rating: ratingRule,
});
