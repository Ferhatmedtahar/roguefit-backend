import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import crypto from "crypto";

import { User } from "../models/user.model";
import { sendEmail } from "../services/email";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface CustomReq extends Request {
  user?: any;
}

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
      return next(new AppError("Token generation failed ", 404));
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
      return next(new AppError("Token generation failed ", 404));
    }
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

// REVIEW protect routes and validate in each step

export const protect = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization?.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("invalid token", 401));

    if (!process.env.JWT_SECRET)
      return next(new AppError("secret could not be found", 404));

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user)
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );

    // !for security we check this important.
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("user recently changed password, please log in again", 401)
      );
    }
    // $GRANT ACCESS TO PROTECTED ROUTES & REGISTER THE USER IN THE REQ

    req.user = user;
    next();
  }
);

// REVIEW restrictTO , to allow only certain user to do some stuff

export const restrictTO = (...roles: any[]) => {
  return (req: CustomReq, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "You do not have the permission to perform this action",
          403
        )
      );
    next();
  };
};

// REVIEW step1 for reset password functionallity :forgot password which send a email .

export const forgotPassword = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email)
      return next(
        new AppError("no email was found , please provide an email", 400)
      );

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("no user found with this email", 404));

    //
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // $ 3 /send this reset token on url in email

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password?Sumbit a Patch REQUEST with your new password and the confirm password to :${resetURL}.\nIf you didnt forget your password , please ignore this email!  `;

    // £ IF ERRROR HAPPEND WE WANT TO RESET THE RESETTOKEN AND EXPIRES 'UNDEFINED' AND SAVE.

    try {
      await sendEmail({
        email: user.email,
        subject: "your password reset Token (valid for 10 min)",
        message,
      });

      // !RESPONSE

      res.status(200).json({
        status: "success",
        message: "token send to email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "there was an error sending the email , try again later",
          500
        )
      );
    }
  }
);

// REVIEW step2 for reset password functionallity :reset password .

export const resetPassword = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) return next(new AppError("Invalid token or has expired ", 400));
    // 2 fill the user password and stuff
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    // 3 log the user in
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
