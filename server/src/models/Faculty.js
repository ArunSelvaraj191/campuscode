import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Faculty = sequelize.define(
  "Faculty",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "inactive", "on_leave", "retired"]],
      },
    },
  },
  {
    tableName: "faculty",
    underscored: true,
    timestamps: false,
  }
);

// Define associations
Faculty.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasOne(Faculty, {
  foreignKey: "user_id",
  as: "faculty",
});

export default Faculty;
