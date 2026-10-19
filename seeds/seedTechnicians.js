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

    const technicians = [
      { name: "Budi", phone: "081234567809", status: "active" },
      { name: "Rafli", phone: "081234567810", status: "inactive" },
      { name: "Andi", phone: "081234567811", status: "active" },
      { name: "Charlie", phone: "081234567812", status: "active" },
      { name: "Daryl", phone: "081234567813", status: "active" },
      { name: "Eko", phone: "081234567814", status: "active" },
      { name: "Fadhil", phone: "081234567815", status: "inactive" },
    ];

    await Technician.bulkCreate(technicians);

    console.log("[technicians] seeded 7 rows");
    process.exit(0);
  } catch (err) {
    console.error("[technicians] failed:", err.message);
    process.exit(1);
  }
};

run();
