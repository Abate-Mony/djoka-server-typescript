import { Router } from "express";
const router = Router();
import {
  createTasks,
  deleteTask,
  getTasks,
  getStaticTask,
  updateTask,
  showStats,
} from "../controllers/taskControllers.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../utils/constant.js";
import upload from "../middleware/multerMiddleware.js";
import { paginationMiddleware } from "../middleware/paginationMiddleware.js";
router.post(
  "/new",
  authenticateUser,
  authorizePermissions(USER_ROLES.user, USER_ROLES.admin),
  upload.array("uploadedImages", 10),
  createTasks
);
router.get("/all", authenticateUser, paginationMiddleware, getTasks);
router.get("/", getStaticTask);
router.delete("/delete/:id", authenticateUser, deleteTask);
router.patch(
  "/update/:tracking_number",
  authenticateUser,
  authorizePermissions("student", "admin"),
  updateTask
);
router.get(
  "/stats",
  authenticateUser,
  authorizePermissions("admin", "student"),
  showStats
);
export default router;
