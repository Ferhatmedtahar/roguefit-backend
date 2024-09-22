import { NextFunction, Request, Response } from "express";

export function getAllOrders(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({
    status: "success",
  });
}
