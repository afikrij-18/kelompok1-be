import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Customer = db.define(
  "customer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Opsional: pastikan nomor telepon unik per customer
    },
  },
  {
    tableName: "customers",
    timestamps: true,
  }
);

export default Customer;