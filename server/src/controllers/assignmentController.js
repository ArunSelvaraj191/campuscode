import Assignment from "../models/Assignment.js";
import Batch from "../models/Batch.js";
import User from "../models/User.js";
import {
  sendServerError,
  sendNotFoundError,
  sendValidationError,
} from "../utils/errorHandler.js";

// Create assignment
export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      attachments,
      auto_evaluation,
      due_date,
      start_time,
      duration_mins,
      visibility,
      grading_type,
      total_marks,
      release_option,
      preview,
      assigned_batches,
    } = req.body;

    if (!title) {
      return sendValidationError(res, "Title is required");
    }

    // created_by: if authentication middleware sets req.user use it, otherwise accept provided
    // verifyToken middleware attaches `req.user` (decoded token payload)
    const created_by =
      (req.user && (req.user.id || req.user.userId)) || req.body.created_by;
    if (!created_by) {
      return sendValidationError(res, "created_by is required");
    }

    const assignment = await Assignment.create({
      title,
      description,
      attachments,
      auto_evaluation,
      due_date,
      start_time,
      duration_mins,
      visibility,
      grading_type,
      total_marks,
      release_option,
      preview,
      created_by,
    });

    // associate batches if provided
    if (Array.isArray(assigned_batches) && assigned_batches.length > 0) {
      const batches = await Batch.findAll({ where: { id: assigned_batches } });
      await assignment.setBatches(batches);
    }

    const result = await Assignment.findByPk(assignment.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: Batch, as: "batches" },
      ],
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);
    if (!assignment) return sendNotFoundError(res, "Assignment");

    const updates = req.body;
    await assignment.update(updates);

    // If batches provided, update associations
    if (Array.isArray(updates.assigned_batches)) {
      const batches = await Batch.findAll({
        where: { id: updates.assigned_batches },
      });
      await assignment.setBatches(batches);
    }

    const result = await Assignment.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: Batch, as: "batches" },
      ],
    });

    res.json(result);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Get all assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: Batch, as: "batches" },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single assignment
export const getAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: Batch, as: "batches" },
      ],
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // remove batch associations
    await assignment.setBatches([]);
    await assignment.destroy();
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
