import express from "express";
import { getAllReviews } from "../controllers/review.controller";

const router = express.Router();

router.route("/").get(getAllReviews);

export default router;
