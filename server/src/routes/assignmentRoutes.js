import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAllAssignments,
  getAssignment,
  updateAssignment,
} from "../controllers/assignmentController.js";
import { checkFacultyRole } from "../middleware/checkFacultyRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST /api/assignments (protected - faculty only)
router.post("/", verifyToken, checkFacultyRole, createAssignment);

// GET all
router.get("/", verifyToken, getAllAssignments);

// GET one
router.get("/:id", verifyToken, getAssignment);

// PUT update (protected - faculty only)
router.put("/:id", verifyToken, checkFacultyRole, updateAssignment);

// DELETE (protected - faculty only)
router.delete("/:id", verifyToken, deleteAssignment);

export default router;
