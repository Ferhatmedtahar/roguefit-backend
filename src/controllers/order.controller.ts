import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import { APIFeatures } from "../utils/APIfeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface CustomReq extends Request {
  user?: any;
}
export const getAllOrders = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const query = new APIFeatures(Order.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const orders = await query.query;

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
  async (req: CustomReq, res: Response, next: NextFunction) => {
    // £ we dont get the total price but we calculate it
    const customer = req.user._id;
    const {
      customerContact,
      status,
      deliveryType,
      products,
      state,
      adress,
      isPaid,
    } = req.body;

    // $ need to check the products and id and stock for them .
    const newOrder = await Order.create({
      customer,
      customerContact,
      state,
      adress,
      deliveryType,
      status,
      products,
      isPaid,
    });
    if (!newOrder) return next(new AppError("order could not be created", 400));
    const selectedOrder = await Order.findById(newOrder._id).select(
      "customerContact state adress deliveryType status products totalPrice isPaid"
    );
    res.status(201).json({
      status: "success",
      selectedOrder,
    });
  }
);

// REVIEW  UPDATE IT SELF
export const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updateObject: any = {};
    // TODO update the status and paid only , cancel can happend only if the status still processing or pending .

    const curOrder = await Order.findById(req.params.id);
    const { isPaid } = req.body;

    // cancel order only when its the proccessing and pending .
    if (isPaid) {
      updateObject.isPaid = true; //
      updateObject.status = "processing"; // Set the status to canceled if `isPaid` is not provided
    } else {
      updateObject.status = "canceled"; // Set the status to canceled if `isPaid` is not provided
    }
    const order = await Order.findByIdAndUpdate(req.params.id, updateObject, {
      runValidators: true,
      new: true,
    });
    if (!order) return next(new AppError("order could not be canceled", 404));
    res.status(200).json({ status: "success", data: order });
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
