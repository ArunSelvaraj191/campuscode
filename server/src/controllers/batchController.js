import Batch from "../models/Batch.js";
import User from "../models/User.js";
import {
  sendNotFoundError,
  sendServerError,
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
    // Pagination: page (1-based) and limit
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const { count, rows } = await Batch.findAndCountAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages,
      },
    });
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

// Update batch
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return sendNotFoundError(res, "Batch");
    }

    const { name, graduationYear, courseDepartment, description } = req.body;

    // Basic validation
    if (!name || !graduationYear || !courseDepartment) {
      return sendValidationError(
        res,
        "Name, graduation year, and course/department are required."
      );
    }

    await batch.update({
      name,
      graduation_year: graduationYear,
      course_department: courseDepartment,
      description,
    });

    const updatedBatch = await Batch.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(updatedBatch);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Delete batch
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return sendNotFoundError(res, "Batch");
    }

    await batch.destroy();
    res.json({ message: "Batch deleted successfully", id });
  } catch (err) {
    return sendServerError(res, err);
  }
};
