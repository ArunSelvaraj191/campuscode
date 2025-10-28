import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Batch = sequelize.define(
  "Batch",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    graduation_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "batches",
    underscored: true, // This ensures Sequelize uses snake_case for column names
    timestamps: true, // This will use created_at and updated_at
  }
);

// Define association
Batch.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

export default Batch;
