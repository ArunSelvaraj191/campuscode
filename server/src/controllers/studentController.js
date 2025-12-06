import Batch from "../models/Batch.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import {
  sendNotFoundError,
  sendServerError,
  sendValidationError,
} from "../utils/errorHandler.js";

// Create a new student (enroll)
export const createStudent = async (req, res) => {
  try {
    const { name, email, batch_id } = req.body;

    // Basic validation
    if (!name || !email || !batch_id) {
      return sendValidationError(
        res,
        "Name, email, and batch_id are required."
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendValidationError(res, "Invalid email format.");
    }

    // Check if batch exists
    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return sendNotFoundError(res, "Batch");
    }

    // Check if user with this email already exists
    let user = await User.findOne({ where: { email } });

    // If user doesn't exist, create one with role 'student'
    if (!user) {
      user = await User.create({
        name,
        email,
        role: "student",
        password: null, // Password will be set during first login/registration
      });
    }

    // Check if student is already enrolled in this batch
    const existingEnrollment = await Student.findOne({
      where: { user_id: user.id, batch_id },
    });

    if (existingEnrollment) {
      return sendValidationError(
        res,
        "Student is already enrolled in this batch."
      );
    }

    // Create student enrollment
    const student = await Student.create({
      user_id: user.id,
      batch_id,
      enrollment_date: new Date(),
      status: "active",
    });

    // Fetch the complete student object with associations
    const populatedStudent = await Student.findByPk(student.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "name", "graduation_year", "course_department"],
        },
      ],
    });

    res.status(201).json(populatedStudent);
  } catch (err) {
    console.error("Error creating student:", err);
    return sendServerError(res, err);
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    // Pagination: page (1-based) and limit
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const { count, rows } = await Student.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "name", "graduation_year", "course_department"],
        },
      ],
      limit,
      offset,
      order: [["enrollment_date", "DESC"]],
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
    console.error("Error fetching students:", err);
    return sendServerError(res, err);
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "name", "graduation_year", "course_department"],
        },
      ],
    });

    if (!student) {
      return sendNotFoundError(res, "Student");
    }

    res.json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    return sendServerError(res, err);
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, batch_id, status } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return sendNotFoundError(res, "Student");
    }

    // If updating batch_id, check if batch exists and student isn't already enrolled
    if (batch_id && batch_id !== student.batch_id) {
      const batch = await Batch.findByPk(batch_id);
      if (!batch) {
        return sendNotFoundError(res, "Batch");
      }

      const existingEnrollment = await Student.findOne({
        where: { user_id: student.user_id, batch_id },
      });

      if (existingEnrollment) {
        return sendValidationError(
          res,
          "Student is already enrolled in this batch."
        );
      }

      student.batch_id = batch_id;
    }

    // Update user info if provided
    if (name || email) {
      await User.update(
        {
          ...(name && { name }),
          ...(email && { email }),
        },
        { where: { id: student.user_id } }
      );
    }

    // Update student status if provided
    if (status) {
      student.status = status;
    }

    await student.save();

    // Fetch updated student with associations
    const updatedStudent = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "name", "graduation_year", "course_department"],
        },
      ],
    });

    res.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    return sendServerError(res, err);
  }
};

// Delete student (unenroll)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return sendNotFoundError(res, "Student");
    }

    await student.destroy();

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    return sendServerError(res, err);
  }
};

// Get students by batch
export const getStudentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    // Verify batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return sendNotFoundError(res, "Batch");
    }

    const { count, rows } = await Student.findAndCountAll({
      where: { batch_id: batchId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      limit,
      offset,
      order: [["enrollment_date", "DESC"]],
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
    console.error("Error fetching batch students:", err);
    return sendServerError(res, err);
  }
};
