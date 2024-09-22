import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").patch(updateProduct);
export default router;
