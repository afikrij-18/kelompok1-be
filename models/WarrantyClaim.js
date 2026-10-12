import { DataTypes } from "sequelize";
import db from "../config/database.js";

const WarrantyClaim = db.define(
  "warranty_claims",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    claim_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    keluhan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "in_progress", "completed"),
      defaultValue: "pending",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    handled_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "warranty_claims",
    timestamps: true,
  }
);

export default WarrantyClaim;