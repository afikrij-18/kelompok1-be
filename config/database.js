import { Sequelize } from "sequelize";

const db = new Sequelize("kelompok1_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
