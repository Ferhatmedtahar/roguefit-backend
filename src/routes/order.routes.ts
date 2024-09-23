import express from "express";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
} from "../controllers/order.controller";

const router = express.Router();

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:id").get(getOrder).patch(cancelOrder).delete(deleteOrder);

export default router;
