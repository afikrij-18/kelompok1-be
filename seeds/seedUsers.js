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

    const passwordAdmin = await bcrypt.hash("admin123", 10);
    const passwordOwner = await bcrypt.hash("owner123", 10);

    await User.bulkCreate([
      {
        name: "Admin Utama",
        email: "admin@example.com",
        password: passwordAdmin,
        phone: "081234567890",
        status: "active",
        role: "admin",
      },
      {
        name: "Owner Utama",
        email: "owner@example.com",
        password: passwordOwner,
        phone: "081234567891",
        status: "active",
        role: "owner",
      },
    ]);

    console.log("[users] seeded: admin@example.com / owner@example.com");
    process.exit(0);
  } catch (err) {
    console.error("[users] failed:", err.message);
    process.exit(1);
  }
};

run();
