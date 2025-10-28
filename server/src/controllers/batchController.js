import Batch from "../models/Batch.js";
import User from "../models/User.js";
import {
  sendServerError,
  sendNotFoundError,
  sendValidationError,
} from "../utils/errorHandler.js";

// Create a new batch
export const createBatch = async (req, res) => {
  try {
    const { name, graduationYear, courseDepartment, description } = req.body;

    // Basic validation
    if (!name || !graduationYear || !courseDepartment) {
      return sendValidationError(
        res,
        "Name, graduation year, and course/department are required."
      );
    }

    const batch = await Batch.create({
      name,
      graduation_year: graduationYear,
      course_department: courseDepartment,
      description,
      created_by: req.user.id,
    });

    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all batches
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"], // Exclude sensitive data
        },
      ],
    });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get batch by ID
export const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!batch) {
      return sendNotFoundError(res, "Batch");
    }

    res.json(batch);
  } catch (err) {
    return sendServerError(res, err);
  }
};
