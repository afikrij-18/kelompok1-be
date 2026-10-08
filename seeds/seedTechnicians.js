import db from "../config/database.js";
import { Technician } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[technicians] DB connected...");

    const count = await Technician.count();
    if (count > 0) {
      console.log(`[technicians] skipped, already ${count} rows`);
      process.exit(0);
    }

    await Technician.bulkCreate([
      { name: "Budi Santoso", phone: "081212121211", status: "active" },
      { name: "Agus Wijaya", phone: "081212121212", status: "active" },
      { name: "Rina Marlina", phone: "081212121213", status: "inactive" },
    ]);

    console.log("[technicians] seeded 3 rows");
    process.exit(0);
  } catch (err) {
    console.error("[technicians] failed:", err.message);
    process.exit(1);
  }
};

run();
