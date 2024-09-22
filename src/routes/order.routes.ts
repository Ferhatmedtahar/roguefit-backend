import express from "express";
import { getAllOrders } from "../controllers/order.controller";

const router = express.Router();

router.route("/").get(getAllOrders);

export default router;
