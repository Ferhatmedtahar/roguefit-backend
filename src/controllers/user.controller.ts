import { NextFunction, Request, Response } from "express";

import { User } from "../models/user.model";
import { AppError } from "../utils/appError";
import { APIFeatures } from "../utils/APIfeatures";
import { catchAsync } from "../utils/catchAsync";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const users = await query.query;
    if (!users) return next(new AppError("no products found!", 404));

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }
);
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    user,
  });
}
export function updateUser(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    status: "success",
  });
}
export function deleteUser(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    status: "success",
  });
}
export function createUser(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    status: "success",
  });
}
