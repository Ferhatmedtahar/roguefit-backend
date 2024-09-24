import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { User } from "../models/user.model";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

// REVIEW sign token to clean the code

const signToken = (id: any): string | undefined => {
  if (!process.env.JWT_SECRET) return undefined;
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

// REVIEW signup and the steps

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    if (!newUser) return next(new AppError("user could not be created", 400));

    const token = signToken(newUser._id);
    if (!token) {
      next(new AppError("Token generation failed ", 404));
    }
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);

// REVIEW login and the steps
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // check the email and password
    if (!email || !password)
      return next(new AppError("email or password are missing ", 400));

    const user = await User.findOne({ email }).select("password");
    // check if user exist

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError("Incorrect email or  password!", 401));

    // generate token and check if it exist
    const token = signToken(user._id);

    if (!token) {
      next(new AppError("Token generation failed ", 404));
    }
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
