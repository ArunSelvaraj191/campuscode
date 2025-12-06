import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/db.js";
import { initializeDatabase } from "./config/dbInit.js";
import "./models/Faculty.js"; // Ensure Faculty model is loaded for associations
import "./models/Student.js"; // Ensure Student model is loaded for associations
import assignmentRoutes from "./routes/assignmentRoutes.js";
import userRoutes from "./routes/authRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);

const PORT = process.env.PORT || 5000;

// Test DB Connection and Initialize
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ PostgreSQL Connected");
    return initializeDatabase();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  });
