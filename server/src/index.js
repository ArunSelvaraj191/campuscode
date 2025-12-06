import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/db.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import userRoutes from "./routes/authRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/assignments", assignmentRoutes);

const PORT = process.env.PORT || 5000;

// Test DB Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
