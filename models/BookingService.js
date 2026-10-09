import { DataTypes } from "sequelize";
import db from "../config/database.js";

const BookingService = db.define(
    "booking_service",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reg_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending", // pending, confirmed, completed, cancelled
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        booking_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        booking_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        technician_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "booking_services",
        timestamps: true,
    }
);

export default BookingService;
