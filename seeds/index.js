import { execSync } from "child_process";

const seeders = [
  "seedUsers.js",           // Users first (for admin/created_by references)
  "seedMaster.js",          // Categories & Services (master data)
  "seedBanks.js",           // Banks for transactions
  "seedExpenseCategories.js", // Expense categories
  "seedTechnicians.js",     // Technicians
  "seedProducts.js",        // Products
  "seedCustomers.js",       // Customers & Addresses
  "seedExpenses.js",        // Expenses (depends on users, banks, categories)
  "seedBookings.js",        // Bookings (depends on services, customers, technicians, addresses)
  "seedTransactions.js",    // Transactions (depends on bookings, users, banks)
  "seedWarranties.js",      // Warranties (depends on bookings)
];

console.log("=== RUNNING ALL SEEDERS IN SEQUENCE ===\n");

for (const file of seeders) {
  try {
    console.log(`> Running seeds/${file}...`);
    execSync(`node seeds/${file}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`X Failed running seeds/${file}`);
    process.exit(1);
  }
}

console.log("\n=== ALL SEEDERS COMPLETED SUCCESSFULLY ===");
