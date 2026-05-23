import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Channel from "./channel.model.js";

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
    channel_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: Channel,
    key: "id",
  },
  onDelete: "CASCADE",
},
     expires_at: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM("draft", "active", "passive", "expired"), allowNull: false, defaultValue: "active" },
    visibility: { type: DataTypes.ENUM("public", "channel"), allowNull: false, defaultValue: "public" },
  },
  {
    timestamps: false,
    tableName: "job_posts",
     indexes: [{ fields: ["channel_id"] }, { fields: ["status", "expires_at"] }],
  }
);

// Kullanıcı ile ilişkilendirme
JobPost.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(JobPost, { foreignKey: "user_id", onDelete: "CASCADE" });

JobPost.belongsTo(Channel,{ foreignKey: "channel_id", onDelete: "CASCADE" });
Channel.hasMany(JobPost,  { foreignKey: "channel_id", onDelete: "CASCADE" });

export default JobPost;