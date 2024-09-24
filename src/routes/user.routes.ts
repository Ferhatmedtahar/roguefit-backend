import express from "express";
import { login, signUp } from "../controllers/auth.controller";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

// login and signup

router.post("/signup", signUp);
router.post("/login", login);

//  £ for admin

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser).get(getUser);

export default router;
