import db from "../config/database.js";
import { Service } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[services] DB connected...");

    const count = await Service.count();
    if (count > 0) {
      console.log(`[services] skipped, already ${count} rows`);
      process.exit(0);
    }

    await Service.bulkCreate([
      { name: "Service AC Biasa", description: "Pemberisihan standar", price: 90000, category_id: 1 },
      { name: "Service AC Extra (Cuci Steam)", description: "Cuci steam menyeluruh", price: 175000, category_id: 1 },
      { name: "Perbaikan Kapasitor", description: "Ganti kapasitor baru", price: 250000, category_id: 2 },
      { name: "Bongkar AC", description: "Bongkar unit AC", price: 150000, category_id: 3 },
      { name: "Pasang AC", description: "Pasang unit AC", price: 250000, category_id: 3 },
    ]);

    console.log("[services] seeded 5 rows");
    process.exit(0);
  } catch (err) {
    console.error("[services] failed:", err.message);
    process.exit(1);
  }
};

run();
