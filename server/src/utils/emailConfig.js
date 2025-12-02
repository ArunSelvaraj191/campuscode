import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 587;
const secure = port === 465; // implicit TLS on 465, STARTTLS on 587

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: !secure, // use STARTTLS when not using implicit TLS
  tls: {
    // DEV: allow self-signed certs only when not in production
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
  // increase timeouts to avoid "Greeting never received" on slow networks
  greetingTimeout: 30000,
  connectionTimeout: 30000,
});

export const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

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
