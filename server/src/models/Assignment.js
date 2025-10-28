import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Batch from "./Batch.js";

const Assignment = sequelize.define(
  "Assignment",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      // store as JSON array of file metadata/URLs
      type: DataTypes.JSON,
      allowNull: true,
    },
    auto_evaluation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    duration_mins: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    visibility: {
      // e.g., 'selected_batches', 'all_students'
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "selected_batches",
    },
    grading_type: {
      // 'auto' or 'manual'
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "manual",
    },
    total_marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    release_option: {
      // 'immediate' or 'schedule'
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "immediate",
    },
    preview: {
      // small JSON summary used by UI
      type: DataTypes.JSON,
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
    tableName: "assignments",
    underscored: true,
    timestamps: true,
  }
);

// Associations
Assignment.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

// Many-to-many with Batch through AssignmentBatch
const AssignmentBatch = sequelize.define(
  "AssignmentBatch",
  {
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Assignment, key: "id" },
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Batch, key: "id" },
    },
  },
  {
    tableName: "assignment_batches",
    underscored: true,
    timestamps: false,
  }
);

Assignment.belongsToMany(Batch, {
  through: AssignmentBatch,
  foreignKey: "assignment_id",
  otherKey: "batch_id",
  as: "batches",
});

Batch.belongsToMany(Assignment, {
  through: AssignmentBatch,
  foreignKey: "batch_id",
  otherKey: "assignment_id",
  as: "assignments",
});

export default Assignment;
export { AssignmentBatch };
