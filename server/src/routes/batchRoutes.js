import express from "express";
import {
  createBatch,
  deleteBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
} from "../controllers/batchController.js";
import { checkFacultyRole } from "../middleware/checkFacultyRole.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create batch (faculty only)
router.post("/", verifyToken, checkFacultyRole, createBatch);

// Get all batches (accessible to all authenticated users)
router.get("/", verifyToken, getAllBatches);

// Get batch by ID (accessible to all authenticated users)
router.get("/:id", verifyToken, getBatchById);

// Update batch (faculty only)
router.put("/:id", verifyToken, checkFacultyRole, updateBatch);

// Delete batch (faculty only)
router.delete("/:id", verifyToken, checkFacultyRole, deleteBatch);

export default router;
