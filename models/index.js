import db from "../config/database.js";
import Category from "./Category.js";
import Service from "./Service.js";
import Customer from "./Customer.js";
import BookingService from "./BookingService.js";
import BookingUnit from "./BookingUnit.js";

// ==========================================
// 1. RELASI KATEGORI & SERVICE
// ==========================================
// Self-association untuk Kategori Berjenjang (Parent-Child)
Category.hasMany(Category, { as: "children", foreignKey: "parent_id" });
Category.belongsTo(Category, { as: "parent", foreignKey: "parent_id" });

// Relasi Kategori ke Service
Category.hasMany(Service, { as: "services", foreignKey: "category_id" });
Service.belongsTo(Category, { as: "category", foreignKey: "category_id" });

// ==========================================
// 2. RELASI CUSTOMER & BOOKING SERVICE
// ==========================================
Customer.hasMany(BookingService, { as: "bookings", foreignKey: "customer_id" });
BookingService.belongsTo(Customer, {
  as: "customer",
  foreignKey: "customer_id",
});

// ==========================================
// 3. RELASI BOOKING SERVICE & BOOKING UNIT
// ==========================================
BookingService.hasMany(BookingUnit, { as: "units", foreignKey: "booking_id" });
BookingUnit.belongsTo(BookingService, {
  as: "booking",
  foreignKey: "booking_id",
});

// ==========================================
// 4. RELASI SERVICE & BOOKING UNIT
// ==========================================
Service.hasMany(BookingUnit, { as: "bookingUnits", foreignKey: "service_id" });
BookingUnit.belongsTo(Service, { as: "service", foreignKey: "service_id" });

// Export semuanya bersama instance database
export { db, Category, Service, Customer, BookingService, BookingUnit };
