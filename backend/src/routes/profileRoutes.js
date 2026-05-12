import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  updateCurrentUser,
  changePassword,
  updateAvatar
} from "../controllers/userController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.put("/me", protect, updateCurrentUser);
router.patch("/change-password", protect, changePassword);
router.patch("/avatar", protect, upload.single("avatar"), updateAvatar);

export default router;

