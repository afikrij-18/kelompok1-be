import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Expense = db.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Format tanggal tidak valid",
        },
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Kategori wajib dipilih",
        },
      },
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Keterangan wajib diisi",
        },
        len: {
          args: [3, 2000],
          msg: "Keterangan harus 3-2000 karakter",
        },
      },
    },
    metode: {
      type: DataTypes.ENUM("cash", "transfer_bank", "qris"),
      allowNull: false,
    },
    bank: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Jumlah harus lebih dari 0",
        },
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
  },
);

export default Expense;
