import express from "express";
import orderRouter from "./order.routes";
import productRouter from "./product.routes";
import reviewRouter from "./review.routes";
import userRouter from "./user.routes";

const router = express.Router();

router.use("/products", productRouter);
router.use("/reviews", reviewRouter);
router.use("/users", userRouter);
router.use("/orders", orderRouter);
export default router;
