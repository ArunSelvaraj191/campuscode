import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";
import { sendResetPasswordEmail } from "../utils/emailConfig.js";
import {
  sendNotFoundError,
  sendServerError,
  sendUnauthorizedError,
  sendValidationError,
} from "../utils/errorHandler.js";

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendValidationError(res, "Email and password are required.");
    }
    const user = await User.findOne({
      where: { email },
    });
    console.log("user ::", user);
    if (!user) {
      return sendUnauthorizedError(res);
    }
    // Role-based verification: requested role must match user's role
    const requestedRole = req.body.role;
    if (!requestedRole || user.role !== requestedRole) {
      return sendUnauthorizedError(
        res,
        `User role '${user.role}' does not match requested role '${requestedRole}'.`
      );
    }
    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      return sendUnauthorizedError(res);
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.json({
      message: "Login successful",
      token,
      data: user,
    });
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

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("email ::::", email);

    if (!email) {
      return sendValidationError(res, "Email is required");
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    console.log("user :::", user, !user);
    if (!user) {
      return sendNotFoundError(res, "User");
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    // Save token and expiry to user
    await user.update({
      reset_password_token: hash,
      reset_password_expires: new Date(Date.now() + 3600000), // 1 hour
    });

    console.log(">>>>>>>>>>", email, resetToken);

    // Send reset email
    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: "Password reset email sent successfully", data: user });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Verify reset token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const tokenStr = decodeURIComponent(String(token || "")).trim();

    console.log("Token (raw) :::", token);
    console.log(
      "Token (decoded/trimmed) :::",
      tokenStr,
      "len:",
      tokenStr.length
    );

    if (!tokenStr) {
      return sendValidationError(res, "Reset token is required");
    }

    const candidates = await User.findAll({
      where: {
        reset_password_expires: { [Op.gt]: new Date() },
        reset_password_token: { [Op.ne]: null },
      },
    });

    if (!candidates || candidates.length === 0) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    let matchedUser = null;
    for (const u of candidates) {
      const hash = u.reset_password_token; // adjust if your model maps to camelCase
      if (!hash) continue;
      const isMatch = await bcrypt.compare(tokenStr, hash);
      console.log(
        `Comparing token with user ${u.email} hash: match=${isMatch}`
      );
      if (isMatch) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    res.json({ message: "Token is valid", userId: matchedUser.id });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Reset password

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const tokenStr = decodeURIComponent(String(token || "")).trim();

    if (!tokenStr || !newPassword) {
      return sendValidationError(res, "Token and new password are required");
    }

    const candidates = await User.findAll({
      where: {
        reset_password_expires: { [Op.gt]: new Date() },
        reset_password_token: { [Op.ne]: null },
      },
    });

    if (!candidates || candidates.length === 0) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    let matchedUser = null;
    for (const u of candidates) {
      const hash = u.reset_password_token;
      if (!hash) continue;
      if (await bcrypt.compare(tokenStr, hash)) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await matchedUser.update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    });

    res.json({ message: "Password reset successful", data: matchedUser });
  } catch (err) {
    return sendServerError(res, err);
  }
};
