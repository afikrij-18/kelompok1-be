import db from "../config/database.js";
import "../models/index.js";
import { execSync } from "child_process";

// Urutan penghapusan tabel dari anak ke induk (child -> parent) untuk menghindari error Foreign Key
const tablesInReverse = [
  "transactions",
  "expenses",
  "expense_categories",
  "warranty_claims",
  "banks",
  "booking_units",
  "booking_services",
  "customer_addresses",
  "customers",
  "services",
  "categories",
  "products",
  "technicians",
  "users",
];

const resetDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Database terhubung, memastikan skema tabel...");

    // Sinkronisasi skema tabel terlebih dahulu jika belum ada
    await db.sync();

    // Nonaktifkan pemeriksaan foreign key sementara
    await db.query("PRAGMA foreign_keys = OFF;");

    for (const table of tablesInReverse) {
      try {
        await db.query(`DELETE FROM \`${table}\`;`);
        console.log(`[DELETE] Isi tabel ${table} berhasil dihapus`);
      } catch (err) {
        console.log(`[WARNING] Gagal menghapus tabel ${table}:`, err.message);
      }
    }

    // Aktifkan kembali foreign key check
    await db.query("PRAGMA foreign_keys = ON;");
    console.log("\nSemua tabel berhasil di-reset (kosong)!\n");

    // Jalankan kembali seluruh seeder secara berurutan
    console.log("Menjalankan ulang seluruh seeder...");
    execSync("node seeds/index.js", { stdio: "inherit" });

    console.log("\n=== RESET & SEEDING SELESAI ===");
    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan reset database:", error.message);
    process.exit(1);
  }
};

resetDatabase();
