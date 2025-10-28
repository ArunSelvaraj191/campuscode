import express from "express";
import {
  getUsers,
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from "../controllers/resetPasswordController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Authentication routes
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/", createUser);
router.get("/", verifyToken, getUsers);

// Password reset routes
router.post("/request-reset", requestPasswordReset);
router.get("/verify-reset/:token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;
