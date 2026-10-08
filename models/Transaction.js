import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Transaction = db.define(
  "transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "transfer_bank", "qris"),
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);

export default Transaction;
