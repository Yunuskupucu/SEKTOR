import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Channel from "./channel.model.js";


const Message = sequelize.define(
  "Message",
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
        model: User, // sınıf ok
        key: "id",
      },
      onDelete: "CASCADE",
    },
    channel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Channel, // sınıf ok
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

   
    type: {
      type: DataTypes.ENUM("text", "job_post", "system"),
      allowNull: false,
      defaultValue: "text",
    },
    job_post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
      references: { model: "job_posts", key: "id" },
      onDelete: "SET NULL",
    },
  },
  {
    timestamps: false,
    tableName: "messages",
    indexes: [
      { fields: ["channel_id", "timestamp"] },
      { fields: ["job_post_id"] },
    ],
  }
);


Message.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
Message.belongsTo(Channel, { foreignKey: "channel_id", onDelete: "CASCADE" });



export default Message;
