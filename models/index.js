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

import Expense from "./Expense.js";
import ExpenseCategory from "./ExpenseCategory.js";

// 1. Kategori layanan dan service
Category.hasMany(Service, {
  as: "services",
  foreignKey: "category_id",
});
Service.belongsTo(Category, {
  as: "category",
  foreignKey: "category_id",
});

// 2. Customer dan alamat
Customer.hasMany(CustomerAddress, {
  as: "addresses",
  foreignKey: "customer_id",
});
CustomerAddress.belongsTo(Customer, {
  as: "customer",
  foreignKey: "customer_id",
});

// 3. Customer dan booking
Customer.hasMany(BookingService, {
  as: "bookings",
  foreignKey: "customer_id",
});
BookingService.belongsTo(Customer, {
  as: "customer",
  foreignKey: "customer_id",
});

// 4. Alamat dan booking
CustomerAddress.hasMany(BookingService, {
  as: "bookings",
  foreignKey: "address_id",
});
BookingService.belongsTo(CustomerAddress, {
  as: "address",
  foreignKey: "address_id",
});

// 5. Booking dan unit
BookingService.hasMany(BookingUnit, {
  as: "units",
  foreignKey: "booking_id",
});
BookingUnit.belongsTo(BookingService, {
  as: "booking",
  foreignKey: "booking_id",
});

// 6. Service dan unit
Service.hasMany(BookingUnit, {
  as: "bookingUnits",
  foreignKey: "service_id",
});
BookingUnit.belongsTo(Service, {
  as: "service",
  foreignKey: "service_id",
});

// 7. Booking dan transaksi pembayaran
BookingService.hasMany(Transaction, {
  as: "transactions",
  foreignKey: "booking_id",
});
Transaction.belongsTo(BookingService, {
  as: "booking",
  foreignKey: "booking_id",
});

// 8. User dan transaksi pembayaran
User.hasMany(Transaction, {
  as: "transactions",
  foreignKey: "created_by",
});
Transaction.belongsTo(User, {
  as: "creator",
  foreignKey: "created_by",
});

// 9. Kategori pengeluaran dan pengeluaran
ExpenseCategory.hasMany(Expense, {
  as: "expenses",
  foreignKey: "category_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Expense.belongsTo(ExpenseCategory, {
  as: "category",
  foreignKey: "category_id",
});

// 10. User dan pengeluaran
User.hasMany(Expense, {
  as: "expenses",
  foreignKey: "created_by",
});
Expense.belongsTo(User, {
  as: "creator",
  foreignKey: "created_by",
});

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
  Expense,
  ExpenseCategory,
};
