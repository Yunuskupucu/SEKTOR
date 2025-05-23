import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});

// MODELLER
const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullname: { type: DataTypes.STRING(200), allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password: { type: DataTypes.TEXT, allowNull: false },
  profile_picture_url: DataTypes.TEXT,
  github: DataTypes.TEXT,
  linkedin: DataTypes.TEXT,
  bio: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: DataTypes.DATE,
}, { timestamps: false });

const Channel = sequelize.define("channels", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: DataTypes.DATE,
}, { timestamps: false });

const Message = sequelize.define("messages", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  channel_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  attachment: DataTypes.TEXT,
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { timestamps: false });

const JobPost = sequelize.define("job_posts", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  salary: DataTypes.STRING(50),
  location: DataTypes.STRING(255),
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  contact: DataTypes.STRING(50),
}, { timestamps: false });

const FilterLog = sequelize.define("filter_logs", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  message_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  flagged_reason: { type: DataTypes.STRING(100), allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { timestamps: false });

// İLİŞKİLER
User.hasMany(Message, { foreignKey: "user_id" });
Message.belongsTo(User, { foreignKey: "user_id" });

Channel.hasMany(Message, { foreignKey: "channel_id" });
Message.belongsTo(Channel, { foreignKey: "channel_id" });

User.hasMany(JobPost, { foreignKey: "user_id" });
JobPost.belongsTo(User, { foreignKey: "user_id" });

Message.hasMany(FilterLog, { foreignKey: "message_id" });
FilterLog.belongsTo(Message, { foreignKey: "message_id" });

User.hasMany(FilterLog, { foreignKey: "user_id" });
FilterLog.belongsTo(User, { foreignKey: "user_id" });

// TRIGGER VE FONKSİYON
async function createTrigger() {
  await sequelize.query(`
    CREATE OR REPLACE FUNCTION update_user_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_user_timestamp'
      ) THEN
        CREATE TRIGGER trigger_update_user_timestamp
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_user_timestamp();
      END IF;
    END;
    $$;
  `);
}

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connected Successfully");
    await sequelize.sync({ alter: true });
    await createTrigger();
    console.log("✅ Tables and triggers are ready");
  } catch (err) {
    console.error("❌ Unable to connect or setup DB:", err);
  }
};

export default sequelize;
