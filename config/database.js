import "dotenv/config";
import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path default ke file SQLite di dalam folder database/
const defaultStorage = path.join(__dirname, "../database/database.sqlite");

// DB_STORAGE boleh absolut atau relatif (relatif akan di-resolve dari folder project)
const resolveStorage = () => {
  const configured = process.env.DB_STORAGE;
  if (!configured) return defaultStorage;
  return path.isAbsolute(configured)
    ? configured
    : path.join(__dirname, "..", configured);
};

const db = new Sequelize({
  dialect: "sqlite",
  storage: resolveStorage(),
  logging: false,
});

export default db;
