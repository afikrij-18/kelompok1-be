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

        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "categories",
        timestamps: true,
    }
);

// Parent → Children
Category.hasMany(Category, {
    as: "children",
    foreignKey: "parent_id",
});

// Child → Parent
Category.belongsTo(Category, {
    as: "parent",
    foreignKey: "parent_id",
});

export default Category;