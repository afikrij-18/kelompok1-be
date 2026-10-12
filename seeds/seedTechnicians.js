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

    const technicians = [];
    for (let i = 1; i <= 15; i++) {
      technicians.push({
        name: `Teknisi ${i}`,
        phone: `0812345678${i < 10 ? '0' + i : i}`,
        status: i % 5 === 0 ? "inactive" : "active",
      });
    }

    await Technician.bulkCreate(technicians);

    console.log("[technicians] seeded 15 rows");
    process.exit(0);
  } catch (err) {
    console.error("[technicians] failed:", err.message);
    process.exit(1);
  }
};

run();
