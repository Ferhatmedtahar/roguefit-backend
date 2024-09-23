import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import { catchAsync } from "../utils/catchAsync";

export function getAllOrders(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    status: "success",
  });
}

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // £ we dont get the total price but we calculate it
    const { customerContact, products, state, adress } = req.body;

    // const totalPrice = 0;

    const newOrder = await Order.create({
      customerContact,
      state,
      adress,
      products,
    });

    res.json({
      newOrder,
    });
  }
);
