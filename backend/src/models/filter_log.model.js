import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Message from "./message.model.js";

const FilterLog = sequelize.define(
  "FilterLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Message,
        key: "id",
      },
      onDelete: "CASCADE",
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
    flagged_reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "filter_logs",
  }
);


FilterLog.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(FilterLog, { foreignKey: "user_id", onDelete: "CASCADE" });

FilterLog.belongsTo(Message, { foreignKey: "message_id", onDelete: "CASCADE" });
Message.hasMany(FilterLog, { foreignKey: "message_id", onDelete: "CASCADE" });

export default FilterLog;
