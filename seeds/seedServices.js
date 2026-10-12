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

    const services = [];
    for (let i = 1; i <= 15; i++) {
      services.push({
        name: `Service Premium ${i}`,
        description: `Deskripsi layanan berkualitas ${i}`,
        price: 50000 + (i * 10000),
        category_id: (i % 15) + 1,
        warranty_days: (i % 30) + 1,
      });
    }

    await Service.bulkCreate(services);

    console.log("[services] seeded 15 rows");
    process.exit(0);
  } catch (err) {
    console.error("[services] failed:", err.message);
    process.exit(1);
  }
};

run();
