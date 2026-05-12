import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);
router.patch("/:id/status", updateTaskStatus);

export default router;
