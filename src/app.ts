import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import apiRoutes from "./routes/index";

dotenv.config();

export const app = express();
app.use(helmet());
app.use(express.json());

app.use("/api/v1", apiRoutes);
