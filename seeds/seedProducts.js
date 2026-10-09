import db from "../config/database.js";
import Product from "../models/Product.js";


const run = async () => {
  try {
    await db.authenticate();
    console.log("[products] DB connected...");

    const count = await Product.count();
    if (count > 0) {
      console.log(`[products] skipped, already ${count} rows`);
      process.exit(0);
    }

    await Product.bulkCreate([
      { name: "Pipa AC 1/4 (Meter)", description: "Pipa tembaga per meter", price: 75000, stock: 100 },
      { name: "Freon R32 (Tabung)", description: "Isi ulang/tabung freon", price: 450000, stock: 15 },
      { name: "Remote AC Universal", description: "Bisa untuk segala jenis AC", price: 65000, stock: 25 },
    ]);

    console.log("[products] seeded 3 rows");
    process.exit(0);
  } catch (err) {
    console.error("[products] failed:", err.message);
    process.exit(1);
  }
};

run();
