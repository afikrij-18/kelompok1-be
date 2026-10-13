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

    const password = await bcrypt.hash("password123", 10);

    const users = [
      { name: "Admin Utama", email: "admin@example.com", password, phone: "081234567890", status: "active", role: "admin" },
      { name: "Owner Utama", email: "owner@example.com", password, phone: "081234567891", status: "active", role: "owner" },
      { name: "Admin", email: "admin@gmail.com", password, phone: "081234567891", status: "active", role: "admin" },
    ];

    for (let i = 1; i <= 13; i++) {
      users.push({
        name: `Admin Dummy ${i}`,
        email: `admin${i}@example.com`,
        password,
        phone: `0812000000${i < 10 ? '0' + i : i}`,
        status: "active",
        role: "admin",
      });
    }

    await User.bulkCreate(users);

    console.log("[users] seeded 15 rows");
    process.exit(0);
  } catch (err) {
    console.error("[users] failed:", err.message);
    process.exit(1);
  }
};

run();
