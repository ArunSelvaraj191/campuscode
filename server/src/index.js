import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/assignments", assignmentRoutes);

const PORT = process.env.PORT || 5000;

// Test DB Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// Example Route
app.get("/", (req, res) => {
  res.send("🚀 Node + PostgreSQL running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
