import db from "../config/database.js";
import { execSync } from "child_process";

// Urutan penghapusan tabel dari anak ke induk (child -> parent) untuk menghindari error Foreign Key
const tablesInReverse = [
  "transactions",
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
    console.log("Database terhubung, memulai proses reset...");

    // Nonaktifkan pemeriksaan foreign key sementara
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");

    for (const table of tablesInReverse) {
      try {
        await db.query(`TRUNCATE TABLE \`${table}\`;`);
        console.log(`[TRUNCATE] Tabel ${table} berhasil dikosongkan`);
      } catch (err) {
        // Fallback jika TRUNCATE gagal pada tabel tertentu
        await db.query(`DELETE FROM \`${table}\`;`);
        console.log(`[DELETE] Isi tabel ${table} berhasil dihapus`);
      }
    }

    // Aktifkan kembali foreign key check
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
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
