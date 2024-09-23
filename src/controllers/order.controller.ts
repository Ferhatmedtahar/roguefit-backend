import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find();
    if (!orders) return next(new AppError("orders could not be found", 404));

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: {
        orders,
      },
    });
  }
);

export const getOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("order could not be found", 404));

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  }
);

//  REVIEW create a order
export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // £ we dont get the total price but we calculate it
    const { customerContact, status, deliveryType, products, state, adress } =
      req.body;

    const newOrder = await Order.create({
      customerContact,
      state,
      adress,
      deliveryType,
      status,
      products,
    });
    if (!newOrder) return next(new AppError("order could not be created", 400));
    const selectedOrder = await Order.findById(newOrder._id).select(
      "customerContact state adress deliveryType status products totalPrice"
    );
    res.status(201).json({
      status: "success",
      selectedOrder,
    });
  }
);

// REVIEW  UPDATE IT SELF
export const cancelOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "canceled",
      },
      { runValidators: true, new: true }
    );
    if (!order) return next(new AppError("order could not be canceled", 404));
    res.status(204).json({ status: "success" });
  }
);

//  ! delete order

export const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return next(new AppError("order could not be canceled", 404));
    res.status(204).json({ status: "success" });
  }
);
