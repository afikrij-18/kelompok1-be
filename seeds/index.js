import { execSync } from "child_process";

const seeders = [
  "seedUsers.js",
  "seedTechnicians.js",
  "seedCategories.js",
  "seedServices.js",
  "seedProducts.js",
  "seedCustomers.js",
  "seedBookings.js",
  "seedTransactions.js",
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
