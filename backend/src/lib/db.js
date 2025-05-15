import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    //NGRGOK

    port: process.env.PG_PORT,
    dialect: 'postgres',
  }
);

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database Connected Successfully');

    // Sequelize modellerine göre eksik tabloları oluştur
    await sequelize.sync({ alter: true });
    console.log('✅ Tables checked/created via Sequelize.sync()');

    // 1. Sütunu NULL olarak ekleyin
    await sequelize.query(`
          ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "fullname" VARCHAR(255);
      `);

    // 2. Mevcut satırlara değer atayın
    await sequelize.query(`
          UPDATE "public"."users" SET "fullname" = 'Unknown' WHERE "fullname" IS NULL;
      `);

    // 3. Sütunu NOT NULL olarak değiştirin
    await sequelize.query(`
          ALTER TABLE "public"."users" ALTER COLUMN "fullname" SET NOT NULL;
      `);

    console.log("✅ Column 'fullname' added and updated successfully");
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

export default sequelize;
