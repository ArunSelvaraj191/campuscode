import Assignment from "../models/Assignment.js";
import Batch from "../models/Batch.js";
import User from "../models/User.js";
import {
  sendNotFoundError,
  sendServerError,
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

    console.log("Creating assignment with data:", {
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

    const assignment = await Assignment.create({
      title,
      description,
      attachments,
      // sanitize values to match DB column types
      auto_evaluation:
        typeof auto_evaluation === "boolean"
          ? auto_evaluation
          : typeof auto_evaluation === "string"
          ? (function () {
              const v = auto_evaluation.trim().toLowerCase();
              if (v === "true" || v === "1") return true;
              if (v === "false" || v === "0" || v === "") return false;
              return Boolean(v);
            })()
          : Boolean(auto_evaluation),
      due_date: due_date ? new Date(due_date) : null,
      start_time: start_time || null,
      duration_mins:
        duration_mins === undefined ||
        duration_mins === null ||
        duration_mins === ""
          ? null
          : parseInt(duration_mins, 10),
      visibility: visibility || "selected_batches",
      grading_type: grading_type || "manual",
      total_marks:
        total_marks === undefined || total_marks === null || total_marks === ""
          ? null
          : parseInt(total_marks, 10),
      release_option: release_option || "immediate",
      preview: preview || null,
      created_by,
    });

    console.log("Created assignment:", assignment);

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
    // Pagination: page (1-based) and limit
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const result = await Assignment.findAndCountAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: Batch, as: "batches" },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const total = Array.isArray(result.count)
      ? result.count.length
      : result.count;
    const totalPages = Math.ceil(total / limit) || 1;

    res.json({ data: result.rows, meta: { total, page, limit, totalPages } });
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
