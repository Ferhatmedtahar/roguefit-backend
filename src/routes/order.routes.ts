import express from "express";
import { protect } from "../controllers/auth.controller";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/order.controller";

const router = express.Router();

router.route("/").get(protect, getAllOrders).post(createOrder);
//  TODO delete should be only for the admin here
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);

export default router;
