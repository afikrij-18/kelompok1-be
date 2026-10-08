import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Category = db.define(
  "Categories",
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
  },
  {
    tableName: "categories",
    timestamps: true,
  },
);

export default Category;
