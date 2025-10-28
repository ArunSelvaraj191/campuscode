import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["student", "faculty", "admin"]],
      },
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false, // no createdAt/updatedAt,
    underscored: true, // Use snake_case for column names
  }
);

export default User;
