import { NextFunction, Request, Response } from "express";
import { Review } from "../models/review.model";
import { APIFeatures } from "../utils/APIfeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface CustomReq extends Request {
  user?: any;
}

export const getAllReviews = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    const features = new APIFeatures(Review.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const reviews = await features.query;
    if (!reviews) return next(new AppError("no reviews found", 404));

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

export const getReview = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return next(new AppError("no reviews found", 404));

    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  }
);

export const setIDs = (req: CustomReq, res: Response, next: NextFunction) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

export const createReview = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    //  £allow nested routes

    const { product, user, content, rating } = req.body;

    const newReview = await Review.create({ product, user, content, rating });
    if (!newReview)
      return next(new AppError("review could not be created", 400));

    res.status(201).json({
      status: "success",
      data: {
        newReview,
      },
    });
  }
);

export const updateReview = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const { content, rating } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { content, rating },
      { new: true, runValidators: true }
    );
    if (!updatedReview)
      return next(new AppError("review could not be updated", 404));

    res.status(200).json({
      status: "success",
      data: {
        updatedReview,
      },
    });
  }
);

export const deleteReview = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) return next(new AppError("review could not be deleted", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
