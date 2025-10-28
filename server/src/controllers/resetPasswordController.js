import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendResetPasswordEmail } from "../utils/emailConfig.js";
import User from "../models/User.js";
import {
  sendServerError,
  sendValidationError,
  sendNotFoundError,
} from "../utils/errorHandler.js";

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
    console.log("user :::", user);
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

    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Verify reset token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return sendValidationError(res, "Reset token is required");
    }

    const user = await User.findOne({
      where: {
        reset_password_expires: { $gt: new Date() },
      },
    });

    if (!user) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    // Verify token
    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    res.json({ message: "Token is valid", userId: user.id });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendValidationError(res, "Token and new password are required");
    }

    // Find user with valid reset token and not expired
    const user = await User.findOne({
      where: {
        resetPasswordExpires: { $gt: new Date() },
      },
    });

    if (!user) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    // Verify token
    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) {
      return sendValidationError(res, "Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token fields
    await user.update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    return sendServerError(res, err);
  }
};
