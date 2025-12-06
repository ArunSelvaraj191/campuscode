import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  getStudentsByBatch,
  updateStudent,
} from "../controllers/studentController.js";
import { checkFacultyRole } from "../middleware/checkFacultyRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create student / Enroll student (faculty only)
router.post("/", verifyToken, checkFacultyRole, createStudent);

// Get all students (faculty only)
router.get("/", verifyToken, checkFacultyRole, getAllStudents);

// Get students by batch (faculty only)
router.get(
  "/batch/:batchId",
  verifyToken,
  checkFacultyRole,
  getStudentsByBatch
);

// Get student by ID (faculty only)
router.get("/:id", verifyToken, checkFacultyRole, getStudentById);

// Update student (faculty only)
router.put("/:id", verifyToken, checkFacultyRole, updateStudent);

// Delete student (faculty only)
router.delete("/:id", verifyToken, checkFacultyRole, deleteStudent);

export default router;
