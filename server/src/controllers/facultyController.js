import Faculty from "../models/Faculty.js";
import User from "../models/User.js";
import {
  sendNotFoundError,
  sendServerError,
  sendValidationError,
} from "../utils/errorHandler.js";

// Create a new faculty
export const createFaculty = async (req, res) => {
  try {
    const { name, email, department, qualification, specialization, phone } =
      req.body;

    // Basic validation
    if (!name || !email || !department) {
      return sendValidationError(
        res,
        "Name, email, and department are required."
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendValidationError(res, "Invalid email format.");
    }

    // Check if user with this email already exists
    let user = await User.findOne({ where: { email } });

    // If user doesn't exist, create one with role 'faculty'
    if (!user) {
      user = await User.create({
        name,
        email,
        role: "faculty",
        password: null, // Password will be set during first login/registration
      });
    } else if (user.role !== "faculty") {
      return sendValidationError(
        res,
        "Email already exists with a different role."
      );
    }

    // Check if faculty profile already exists
    const existingFaculty = await Faculty.findOne({
      where: { user_id: user.id },
    });

    if (existingFaculty) {
      return sendValidationError(res, "Faculty profile already exists.");
    }

    // Create faculty record
    const faculty = await Faculty.create({
      user_id: user.id,
      department,
      qualification: qualification || null,
      specialization: specialization || null,
      phone: phone || null,
      joining_date: new Date(),
      status: "active",
    });

    // Fetch the complete faculty object with associations
    const populatedFaculty = await Faculty.findByPk(faculty.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    res.status(201).json(populatedFaculty);
  } catch (err) {
    console.error("Error creating faculty:", err);
    return sendServerError(res, err);
  }
};

// Get all faculty
export const getAllFaculty = async (req, res) => {
  try {
    // Pagination: page (1-based) and limit
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const { count, rows } = await Faculty.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      limit,
      offset,
      order: [["joining_date", "DESC"]],
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
    console.error("Error fetching faculty:", err);
    return sendServerError(res, err);
  }
};

// Get faculty by ID
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    if (!faculty) {
      return sendNotFoundError(res, "Faculty");
    }

    res.json(faculty);
  } catch (err) {
    console.error("Error fetching faculty:", err);
    return sendServerError(res, err);
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      department,
      qualification,
      specialization,
      phone,
      status,
    } = req.body;

    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return sendNotFoundError(res, "Faculty");
    }

    // Update user info if provided
    if (name || email) {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return sendValidationError(res, "Invalid email format.");
        }

        // Check if email is already used by another user
        const existingEmail = await User.findOne({
          where: {
            email,
            id: { [require("sequelize").Op.ne]: faculty.user_id },
          },
        });
        if (existingEmail) {
          return sendValidationError(res, "Email already in use.");
        }

        updateData.email = email;
      }

      await User.update(updateData, { where: { id: faculty.user_id } });
    }

    // Update faculty details
    if (department) faculty.department = department;
    if (qualification) faculty.qualification = qualification;
    if (specialization) faculty.specialization = specialization;
    if (phone) faculty.phone = phone;
    if (status) faculty.status = status;

    await faculty.save();

    // Fetch updated faculty with associations
    const updatedFaculty = await Faculty.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    res.json(updatedFaculty);
  } catch (err) {
    console.error("Error updating faculty:", err);
    return sendServerError(res, err);
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findByPk(id);
    if (!faculty) {
      return sendNotFoundError(res, "Faculty");
    }

    // Optionally delete associated user account
    const userId = faculty.user_id;
    await faculty.destroy();

    // Uncomment to also delete the user account:
    // await User.destroy({ where: { id: userId } });

    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    console.error("Error deleting faculty:", err);
    return sendServerError(res, err);
  }
};

// Get faculty by department
export const getFacultyByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const offset = (page - 1) * limit;

    const { count, rows } = await Faculty.findAndCountAll({
      where: { department },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      limit,
      offset,
      order: [["joining_date", "DESC"]],
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
    console.error("Error fetching faculty by department:", err);
    return sendServerError(res, err);
  }
};

// Get faculty statistics
export const getFacultyStats = async (req, res) => {
  try {
    const totalFaculty = await Faculty.count();
    const activeFaculty = await Faculty.count({
      where: { status: "active" },
    });
    const inactiveFaculty = await Faculty.count({
      where: { status: "inactive" },
    });
    const onLeaveFaculty = await Faculty.count({
      where: { status: "on_leave" },
    });
    const retiredFaculty = await Faculty.count({
      where: { status: "retired" },
    });

    // Count faculty by department
    const facultyByDept = await Faculty.findAll({
      attributes: [
        "department",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "count",
        ],
      ],
      group: ["department"],
      raw: true,
    });

    res.json({
      totalFaculty,
      activeFaculty,
      inactiveFaculty,
      onLeaveFaculty,
      retiredFaculty,
      facultyByDept,
    });
  } catch (err) {
    console.error("Error fetching faculty stats:", err);
    return sendServerError(res, err);
  }
};
