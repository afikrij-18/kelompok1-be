import { db, WarrantyClaim } from "../models/index.js";

const seedWarranties = async () => {
  try {
    await db.authenticate();
    console.log("[warranties] DB connected...");

    const count = await WarrantyClaim.count();
    if (count > 0) {
      console.log(`[warranties] skipped, already ${count} rows`);
      process.exit(0);
    }

    console.log("[warranties] no warranties to seed (empty in database)");
    process.exit(0);
  } catch (err) {
    console.error("[warranties] failed:", err.message);
    process.exit(1);
  }
};

seedWarranties();
