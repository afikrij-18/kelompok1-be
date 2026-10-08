import db from "../config/database.js";
import User from "./User.js";
import Technician from "./Technician.js";
import Category from "./Category.js";
import Service from "./Service.js";
import Customer from "./Customer.js";
import CustomerAddress from "./CustomerAddress.js";
import BookingService from "./BookingService.js";
import BookingUnit from "./BookingUnit.js";
import Transaction from "./Transaction.js";

// ==========================================
// 1. RELASI KATEGORI & SERVICE
// ==========================================
// Relasi Kategori ke Service (Flat Category)
Category.hasMany(Service, { as: "services", foreignKey: "category_id" });
Service.belongsTo(Category, { as: "category", foreignKey: "category_id" });

// ==========================================
// 2. RELASI CUSTOMER & CUSTOMER ADDRESS
// ==========================================
Customer.hasMany(CustomerAddress, {
  as: "addresses",
  foreignKey: "customer_id",
});
CustomerAddress.belongsTo(Customer, {
  as: "customer",
  foreignKey: "customer_id",
});

// ==========================================
// 3. RELASI CUSTOMER & BOOKING SERVICE
// ==========================================
Customer.hasMany(BookingService, { as: "bookings", foreignKey: "customer_id" });
BookingService.belongsTo(Customer, {
  as: "customer",
  foreignKey: "customer_id",
});

// ==========================================
// 4. RELASI CUSTOMER ADDRESS & BOOKING SERVICE
// ==========================================
CustomerAddress.hasMany(BookingService, {
  as: "bookings",
  foreignKey: "address_id",
});
BookingService.belongsTo(CustomerAddress, {
  as: "address",
  foreignKey: "address_id",
});

// ==========================================
// 5. RELASI BOOKING SERVICE & BOOKING UNIT
// ==========================================
BookingService.hasMany(BookingUnit, { as: "units", foreignKey: "booking_id" });
BookingUnit.belongsTo(BookingService, {
  as: "booking",
  foreignKey: "booking_id",
});

// ==========================================
// 6. RELASI SERVICE & BOOKING UNIT
// ==========================================
Service.hasMany(BookingUnit, { as: "bookingUnits", foreignKey: "service_id" });
BookingUnit.belongsTo(Service, { as: "service", foreignKey: "service_id" });

// ==========================================
// 7. RELASI BOOKING SERVICE & TRANSACTION
// ==========================================
BookingService.hasMany(Transaction, {
  as: "transactions",
  foreignKey: "booking_id",
});
Transaction.belongsTo(BookingService, {
  as: "booking",
  foreignKey: "booking_id",
});

// ==========================================
// 8. RELASI USER (ADMIN/OWNER) & TRANSACTION
// ==========================================
User.hasMany(Transaction, { as: "transactions", foreignKey: "created_by" });
Transaction.belongsTo(User, { as: "creator", foreignKey: "created_by" });

// Export semuanya bersama instance database
export {
  db,
  User,
  Technician,
  Category,
  Service,
  Customer,
  CustomerAddress,
  BookingService,
  BookingUnit,
  Transaction,
};
