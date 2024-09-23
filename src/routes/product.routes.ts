import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getProduct,
} from "../controllers/product.controller";

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").patch(updateProduct).delete(deleteProduct).get(getProduct);
export default router;
