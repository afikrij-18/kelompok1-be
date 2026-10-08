import { DataTypes } from "sequelize";
import db from "../config/database.js";

const CustomerAddress = db.define(
  "customer_address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING, // Contoh: "Rumah Utama", "Kantor", "Toko"
      allowNull: false,
      defaultValue: "Alamat Utama",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notes_location: {
      type: DataTypes.STRING, // Catatan tambahan alamat (misal: "Cat warna hijau dekat pos satpam")
      allowNull: true,
    },
  },
  {
    tableName: "customer_addresses",
    timestamps: true,
  },
);

export default CustomerAddress;
