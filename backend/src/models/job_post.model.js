import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";

const JobPost = sequelize.define(
  "JobPost",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "job_posts",
  }
);

// Kullanıcı ile ilişkilendirme
JobPost.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(JobPost, { foreignKey: "user_id", onDelete: "CASCADE" });

export default JobPost;