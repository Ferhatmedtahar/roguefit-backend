import express from "express";
import { protect, restrictTO } from "../controllers/auth.controller";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  setCustomerID,
  updateOrder,
} from "../controllers/order.controller";
import { validateRequest } from "../validators/validate";
import {
  createOrderSchema,
  updateOrderSchema,
} from "../validators/order.validate";

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(restrictTO("admin"), getAllOrders)
  .post(
    restrictTO("user", "coach"),
    setCustomerID,
    validateRequest(createOrderSchema),
    createOrder
  );

router
  .route("/:id")
  .get(getOrder)
  .patch(
    restrictTO("user", "coach"),
    validateRequest(updateOrderSchema),
    updateOrder
  )
  .delete(restrictTO("admin"), deleteOrder);

export default router;
