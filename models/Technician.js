import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Technician = db.define(
  "technician",
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
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    tableName: "technicians",
    timestamps: true,
  }
);

export default Technician;
