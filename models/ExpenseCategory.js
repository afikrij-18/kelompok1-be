import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ExpenseCategory = db.define(
  "ExpenseCategory",
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
      validate: {
        notEmpty: {
          msg: "Nama kategori wajib diisi",
        },
        len: {
          args: [2, 100],
          msg: "Nama kategori harus 2-100 karakter",
        },
      },
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "expense_categories",
    timestamps: true,
  },
);

export default ExpenseCategory;
