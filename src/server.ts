import mongoose from "mongoose";
import { app } from "./app";

const DB = process.env.MONGO_URI!!;

mongoose.connect(DB);
mongoose.connection
  .once("open", () => {
    console.log("Database connected successfully.");
  })
  .on("error", (err) => {
    console.log(`error :${err.message}`);
  });
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running in localhost:${port}`);
});
