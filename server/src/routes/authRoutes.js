import express from "express";
import {
  createUser,
  getAllUsers,
  getUsers,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Authentication routes
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/users", createUser);
router.get("/users", verifyToken, getAllUsers);
router.get("/users/:user_type", verifyToken, getUsers);

// Password reset routes
router.post("/request-reset", requestPasswordReset);
router.get("/verify-reset/:token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;
