import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your password or app-specific password
  },
});

export const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${
    process.env.CLIENT_URL || "http://localhost:5173"
  }/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset email");
  }
};
