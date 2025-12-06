import sequelize from "../config/db.js";

/**
 * Initialize database and sync all models
 * Run this once to create all tables
 */
export const initializeDatabase = async () => {
  try {
    console.log("🔄 Syncing database models...");

    // Sync all models with force: false (won't drop existing tables)
    // Change force: true only if you want to drop and recreate tables
    await sequelize.sync({ force: false });

    console.log("✅ Database synchronized successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    throw error;
  }
};

export default initializeDatabase;
