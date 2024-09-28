import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import { APIFeatures } from "../utils/APIfeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface CustomReq extends Request {
  user?: any;
}

export const checkOwnershipOrder = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const { id } = req.params; // Order ID from the request params
    const order = await Order.findById(id);

    if (!order) return next(new AppError("order not found", 404));

    if (
      order.customer._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new AppError("You are not allowed to update this order", 401)
      );
    }
    next();
  }
);

/*

export const getCheckoutSession = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const newCheckout = await client.createCheckout({
      items: [
        { price: "PRICE_ID", quantity: 2 },
        { price: "ANOTHER_PRICE_ID", quantity: 1 },
      ],
      success_url: `${req.protocol}://${req.get("host")}/success`,
      failure_url: `${req.protocol}://${req.get("host")}/failure`,
      payment_method: "edahabia",
      customer_id: req.user._id,
      metadata: { orderId: "123456" },
      locale: "en",
      pass_fees_to_customer: false,
    });
  }
);

! Test Mode Base Url: https://pay.chargily.net/test/api/pay-v2


*/
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

export const setCustomerID = (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.customer) req.body.customer = req.user.id;
  next();
};

//  REVIEW create a order
export const createOrder = catchAsync(
  async (req: CustomReq, res: Response, next: NextFunction) => {
    // £ we dont get the total price but we calculate it

    const {
      customer,
      customerContact,
      status,
      deliveryType,
      products,
      state,
      address,
    } = req.body;

    // $ need to check the products and id and stock for them .
    const newOrder = await Order.create({
      customer,
      customerContact,
      state,
      address,
      deliveryType,
      status,
      products,
    });
    if (!newOrder) return next(new AppError("order could not be created", 400));
    const selectedOrder = await Order.findById(newOrder._id).select(
      "customerContact state adress deliveryType status products totalPrice isPaid"
    );
    res.status(201).json({
      status: "success",
      order: selectedOrder,
    });
  }
);

// REVIEW  UPDATE IT SELF
export const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { isPaid, status } = req.body;
    const curOrder = await Order.findById(req.params.id);
    if (!curOrder) return next(new AppError("Order not found", 404));

    if (
      status === "canceled" &&
      (curOrder?.status === "delivered" || curOrder?.status === "shipped")
    )
      return next(
        new AppError(
          "can't update the order after its delivered or shipped",
          400
        )
      );

    if (isPaid && curOrder?.isPaid === true)
      return next(new AppError("can not pay the order twice", 400));

    curOrder.isPaid = isPaid ?? curOrder.isPaid;
    curOrder.status = status ?? curOrder.status;

    await curOrder.save({ validateBeforeSave: true });

    res.status(200).json({ status: "success", data: curOrder });
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
