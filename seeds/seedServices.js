import db from "../config/database.js";
import { Service, Category } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[services] DB connected...");

    const count = await Service.count();
    if (count > 0) {
      console.log(`[services] skipped, already ${count} rows`);
      process.exit(0);
    }

    const categories = await Category.findAll();
    if (categories.length === 0) {
      console.error("[services] seed categories first!");
      process.exit(1);
    }

    const services = [];
    for (let i = 1; i <= 15; i++) {
      const category = categories[(i - 1) % categories.length];
      services.push({
        name: `Service Premium ${i}`,
        description: `Deskripsi layanan berkualitas ${i}`,
        price: 50000 + (i * 10000),
        category_id: category.id,
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
