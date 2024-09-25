import express from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTO,
  signUp,
  updatePassword,
} from "../controllers/auth.controller";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

// £ login and signup and forget  password functionallity

router.post("/signup", signUp);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);

// $ all prev routes doesnt requires login but the rest need so :
router.use(protect);

router.route("/updatePassword").patch(updatePassword);

router.route("/updateMe").patch(updateMe);

router.route("/deleteMe").delete(deleteMe);

router.route("/me").get(getMe, getUser);

//  £ for admin
router.use(restrictTO("admin"));

router.route("/").get(getAllUsers).post(createUser);
router
  .route("/:id")
  .patch(restrictTO("admin"), updateUser)
  .delete(restrictTO("admin"), deleteUser)
  .get(getUser);

export default router;
