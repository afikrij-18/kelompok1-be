import db from "../config/database.js";
import { Product } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[products] DB connected...");

    const count = await Product.count();
    if (count > 0) {
      console.log(`[products] skipped, already ${count} rows`);
      process.exit(0);
    }

    const products = [];
    for (let i = 1; i <= 15; i++) {
      products.push({
        name: `Produk Sparepart ${i}`,
        description: `Deskripsi komponen kualitas tinggi ${i}`,
        price: 50000 + (i * 5000),
        stock: 10 + (i * 2),
      });
    }

    await Product.bulkCreate(products);

    console.log("[products] seeded 15 rows");
    process.exit(0);
  } catch (err) {
    console.error("[products] failed:", err.message);
    process.exit(1);
  }
};

run();
