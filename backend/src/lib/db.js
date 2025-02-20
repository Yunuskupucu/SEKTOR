import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: "postgres",
    }
);

export const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database Connected Successfully");

        // 📌 Tabloları senkronize et
        await sequelize.sync({ alter: true });  // `force: true` yerine `alter: true` kullanıyoruz

        console.log("✅ Tables synchronized!");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
};

export default sequelize;
