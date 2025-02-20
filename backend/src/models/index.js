import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Channel from "./channel.model.js";
import Message from "./message.model.js";
import JobPost from "./job_post.model.js";
import FilterLog from "./filter_log.model.js";

// İlişkileri Tanımla
User.hasMany(Message, { foreignKey: "user_id", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "user_id" });

Channel.hasMany(Message, { foreignKey: "channel_id", onDelete: "CASCADE" });
Message.belongsTo(Channel, { foreignKey: "channel_id" });

User.hasMany(JobPost, { foreignKey: "user_id", onDelete: "CASCADE" });
JobPost.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(FilterLog, { foreignKey: "user_id", onDelete: "CASCADE" });
FilterLog.belongsTo(User, { foreignKey: "user_id" });

Message.hasMany(FilterLog, { foreignKey: "message_id", onDelete: "CASCADE" });
FilterLog.belongsTo(Message, { foreignKey: "message_id" });

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Veritabanını günceller
    console.log("Database & tables synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export { User, Channel, Message, JobPost, FilterLog, syncModels };
