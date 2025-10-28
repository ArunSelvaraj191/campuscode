import express from "express";
import {
  createAssignment,
  updateAssignment,
  getAllAssignments,
  getAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST /api/assignments (protected)
router.post("/", verifyToken, createAssignment);

// GET all
router.get("/", getAllAssignments);

// GET one
router.get("/:id", getAssignment);

// PUT update (protected)
router.put("/:id", verifyToken, updateAssignment);

// DELETE (protected)
router.delete("/:id", verifyToken, deleteAssignment);

export default router;
