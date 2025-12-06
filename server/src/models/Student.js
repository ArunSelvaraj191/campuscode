import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Batch from "./Batch.js";
import User from "./User.js";

const Student = sequelize.define(
  "Student",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Batch,
        key: "id",
      },
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "inactive", "graduated", "suspended"]],
      },
    },
  },
  {
    tableName: "students",
    underscored: true,
    timestamps: false,
  }
);

// Define associations
Student.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Student.belongsTo(Batch, {
  foreignKey: "batch_id",
  as: "batch",
});

User.hasMany(Student, {
  foreignKey: "user_id",
  as: "students",
});

Batch.hasMany(Student, {
  foreignKey: "batch_id",
  as: "enrolledStudents",
});

export default Student;
