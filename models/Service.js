import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Category from "./Category.js";

const Service = db.define(
    "Services",
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

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "services",
        timestamps: true,
    }
);

Service.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
});

Category.hasMany(Service, {
    foreignKey: "category_id",
    as: "services",
});

export default Service;