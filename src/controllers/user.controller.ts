import { NextFunction, Request, Response } from "express";

import { User } from "../models/user.model";
import { APIFeatures } from "../utils/APIfeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface CustomReq extends Request {
  user?: any;
}

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const users = await query.query;
    if (!users) return next(new AppError("users not found!", 404));

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
  const user = await User.findById(req.params.id)
    .populate({
      path: "reviews",
      select: "content rating product -user",
    })
    .populate({
      path: "orders",
      select:
        "isPaid customerContact products state adress deliveryType status",
    });

  if (!user) return next(new AppError("user not found!", 404));
  res.status(200).json({
    status: "success",
    user,
  });
}

export const updateUser = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!updatedUser)
      return next(new AppError("user could not be updated ADMIN ", 404));

    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

export const deleteUser = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return next(new AppError("user could not be deleted ADMIN ", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export function createUser(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    message: "this route are not implemented , please sign up ",
  });
}

/*
















*/
// REVIEW UPDATE THE USER DATA:name , email

export const updateMe = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          "this route is not for password updates , please use /updatePassword",
          400
        )
      );
    // update only the field i want
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser)
      return next(new AppError("user could not be updated ", 404));

    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

// REVIEW DELETE USER , set active :false

export const deleteMe = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          "this route is not for password updates , please use /updatePassword",
          400
        )
      );
    if (req.body.name || req.body.email)
      return next(
        new AppError(
          "this route is not for updating user information , please use /updateMe",
          400
        )
      );
    // update only active field
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        active: false,
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser)
      return next(new AppError("user could not be updated ", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getMe = (req: CustomReq, res: Response, next: NextFunction) => {
  req.params.id = req.user._id;
  next();
};
