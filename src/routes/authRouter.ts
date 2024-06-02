import express from "express";
import {
  login,
  logout,
  register,
} from "../controllers/authController.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middleware/validationMiddleware.js";
const router = express.Router();
router.post("/register", validateRegisterInput, register);

router.post("/login", validateLoginInput, login);
router.get("/logout", logout);
// verify otp for v1.0.1
// router.route("/verified-otp").post(verifiedUser);
export default router;
