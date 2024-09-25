import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signUp,
} from "../controllers/auth.controller";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

// £ login and signup and forget  password functionallity

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
//  £ for admin

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser).get(getUser);

export default router;
