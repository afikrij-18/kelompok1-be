import bcrypt from "bcrypt";
import db from "../config/database.js";
import { User } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[users] DB connected...");

    const count = await User.count();
    if (count > 0) {
      console.log(`[users] skipped, already ${count} rows`);
      process.exit(0);
    }

    // Menggunakan bcrypt cost 12 (sesuai app, sebelumnya di seeder cost 10)
    const rawPassword = process.env.SEED_PASSWORD || "admin123";
    const password = await bcrypt.hash(rawPassword, 12);

    const users = [
      { name: "Admin Utama", email: "admin@example.com", password, phone: "081234567890", status: "active", role: "admin" },
      { name: "Owner Utama", email: "owner@example.com", password, phone: "081234567891", status: "active", role: "owner" },
      { name: "Admin UMKM", email: "admin.umkm@gmail.com", password, phone: "081234567892", status: "active", role: "admin" },
      { name: "Admin Lama", email: "admin@gmail.com", password, phone: "081234567893", status: "active", role: "admin" },
      { name: "Admin Dummy 1", email: "admin1@example.com", password, phone: "081200000001", status: "active", role: "admin" },
      { name: "Admin Dummy 2", email: "admin2@example.com", password, phone: "081200000002", status: "active", role: "admin" },
      { name: "Admin Dummy 3", email: "admin3@example.com", password, phone: "081200000003", status: "active", role: "admin" },
      { name: "Admin Dummy 4", email: "admin4@example.com", password, phone: "081200000004", status: "active", role: "admin" },
      { name: "Admin Dummy 5", email: "admin5@example.com", password, phone: "081200000005", status: "active", role: "admin" },
      { name: "Admin Dummy 6", email: "admin6@example.com", password, phone: "081200000006", status: "active", role: "admin" },
      { name: "Admin Dummy 7", email: "admin7@example.com", password, phone: "081200000007", status: "active", role: "admin" },
      { name: "Admin Dummy 8", email: "admin8@example.com", password, phone: "081200000008", status: "active", role: "admin" },
      { name: "Admin Dummy 9", email: "admin9@example.com", password, phone: "081200000009", status: "active", role: "admin" },
      { name: "Admin Dummy 10", email: "admin10@example.com", password, phone: "081200000010", status: "active", role: "admin" },
      { name: "Admin Dummy 11", email: "admin11@example.com", password, phone: "081200000011", status: "active", role: "admin" },
    ];

    await User.bulkCreate(users);

    console.log(`[users] seeded 15 rows (password: ${rawPassword})`);
    process.exit(0);
  } catch (err) {
    console.error("[users] failed:", err.message);
    process.exit(1);
  }
};

run();
