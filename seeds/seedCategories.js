import db from "../config/database.js";
import { Category } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[categories] DB connected...");

    const count = await Category.count();
    if (count > 0) {
      console.log(`[categories] skipped, already ${count} rows`);
      process.exit(0);
    }

    await Category.bulkCreate([
      { name: "Service AC" },
      { name: "Perbaikan AC" },
      { name: "Bongkar Pasang AC" },
    ]);

    console.log("[categories] seeded 3 rows");
    process.exit(0);
  } catch (err) {
    console.error("[categories] failed:", err.message);
    process.exit(1);
  }
};

run();
