import { DataTypes } from "sequelize";
import db from "../config/database.js";

const BookingUnit = db.define(
    "booking_unit",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        brand_ac: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type_ac: {
            type: DataTypes.STRING, // Split, Cassette, Standing
            allowNull: false,
        },
        pk: {
            type: DataTypes.STRING, // 1/2, 1, 1.5, dll
            allowNull: false,
        },
        lokasi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        keluhan: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "booking_units",
        timestamps: true,
    }
);

export default BookingUnit;