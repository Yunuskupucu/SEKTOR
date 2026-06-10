import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Channel = sequelize.define(
  "Channel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_ad',
    },
  },
  {
    timestamps: false, 
    tableName: "channels",
  }
);

export default Channel;