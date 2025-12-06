import express from "express";
import {
  createFaculty,
  deleteFaculty,
  getAllFaculty,
  getFacultyByDepartment,
  getFacultyById,
  getFacultyStats,
  updateFaculty,
} from "../controllers/facultyController.js";
import { checkFacultyRole } from "../middleware/checkFacultyRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create faculty (admin/faculty only)
router.post("/", verifyToken, checkFacultyRole, createFaculty);

// Get faculty statistics (faculty only)
router.get("/stats", verifyToken, checkFacultyRole, getFacultyStats);

// Get all faculty (faculty only)
router.get("/", verifyToken, checkFacultyRole, getAllFaculty);

// Get faculty by department (faculty only)
router.get(
  "/department/:department",
  verifyToken,
  checkFacultyRole,
  getFacultyByDepartment
);

// Get faculty by ID (faculty only)
router.get("/:id", verifyToken, checkFacultyRole, getFacultyById);

// Update faculty (faculty only)
router.put("/:id", verifyToken, checkFacultyRole, updateFaculty);

// Delete faculty (faculty only)
router.delete("/:id", verifyToken, checkFacultyRole, deleteFaculty);

export default router;
