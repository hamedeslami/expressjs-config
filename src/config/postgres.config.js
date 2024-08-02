import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  ssl: false,
  dialectOptions: {
    clientMinMessages: "notice",
  },
});

sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync({ alter: true });
    console.log("Connect to PostgreSQL Successfully.");
  })
  .catch((error) => {
    console.log("Field connect to PostgreSQL, error: ", error?.message);
  });
