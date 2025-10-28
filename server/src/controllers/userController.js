import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  sendServerError,
  sendValidationError,
  sendUnauthorizedError,
} from "../utils/errorHandler.js";

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendValidationError(res, "Email and password are required.");
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendUnauthorizedError(res);
    }
    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendUnauthorizedError(res);
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "10h" }
    );
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendValidationError(res, "No token provided");
    }

    // Clear any session data if needed
    // Note: The actual token invalidation should be handled on the client side
    // by removing the stored token from localStorage/sessionStorage

    // You could also implement token blacklisting here if needed:
    // await BlacklistedToken.create({ token });

    res.json({
      message: "Logout successful",
      success: true,
    });
  } catch (err) {
    return sendServerError(res, err);
  }
};
// ...existing code...

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    console.log("req.body :", req.body);
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return sendValidationError(
        res,
        "All fields (name, email, password, role) are required."
      );
    }
    if (!["student", "faculty", "admin"].includes(role)) {
      return sendValidationError(
        res,
        "Role must be student, faculty, or admin."
      );
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Don't send password in response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.status(201).json(userResponse);
  } catch (err) {
    return sendServerError(res, err);
  }
};
