import express from "express";
const router = express.Router();
import {
  login,
  logout,
  register,
  verifiedUser,
} from "../controllers/authController.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middleware/validationMiddleware.js";
router.post("/signup", validateRegisterInput, register);

router.post("/login", validateLoginInput, login);
router.get("/logout", logout);
// verify otp for v1.0.1
router.route("/verified-otp").post(verifiedUser);
export default router;
