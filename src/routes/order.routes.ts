import express from "express";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const router = express.Router();

router.route("/").get(getAllOrders).post(createOrder);

export default router;
