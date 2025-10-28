import express from "express";
import {
  createBatch,
  getAllBatches,
  getBatchById,
} from "../controllers/batchController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkFacultyRole } from "../middleware/checkFacultyRole.js";

const router = express.Router();

// Create batch (faculty only)
router.post("/", verifyToken, checkFacultyRole, createBatch);

// Get all batches (accessible to all authenticated users)
router.get("/", verifyToken, getAllBatches);

// Get batch by ID (accessible to all authenticated users)
router.get("/:id", verifyToken, getBatchById);

export default router;
