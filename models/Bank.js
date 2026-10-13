import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Bank = db.define(
  "Bank",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    no_rekening: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    atas_nama: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "banks",
    timestamps: true,
  }
);

export default Bank;
