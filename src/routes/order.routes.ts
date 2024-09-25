import express from "express";
import { protect, restrictTO } from "../controllers/auth.controller";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/order.controller";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllOrders)
  .post(protect, restrictTO("user", "coach"), createOrder);

router
  .route("/:id")
  .get(protect, getOrder)
  .patch(protect, restrictTO("user", "coach"), updateOrder)
  .delete(protect, restrictTO("admin"), deleteOrder);

export default router;
