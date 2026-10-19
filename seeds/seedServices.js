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

    const services = [
      {
        name: "Service AC Biasa",
        description: "Service AC Biasa tanpa membongkar secara keseluruhan",
        price: 90000,
        category_id: categories[0].id,
        warranty_days: 7,
      },
      {
        name: "Service AC Extra",
        description: "Service AC dan membersihkan secara keseluruhan",
        price: 180000,
        category_id: categories[0].id,
        warranty_days: 7,
      },
      {
        name: "Bongkar AC",
        description: "Hanya Membongkar unit AC, tanpa memasangnya lagi.",
        price: 100000,
        category_id: categories[1].id,
        warranty_days: 7,
      },
      {
        name: "Pasang AC",
        description: "Memasang unit AC (unit lama atau baru). belum termasuk harga sparepart (misal: pipa AC, selang pembuangan, kabel sumber, kabel outdoor, dll)",
        price: 150000,
        category_id: categories[1].id,
        warranty_days: 30,
      },
      {
        name: "Bongkar Pasang AC",
        description: "Bongkar dan Pasang AC. belum termasuk harga sparepart (misal: pipa AC, selang pembuangan, kabel sumber, kabel outdoor, dll)",
        price: 250000,
        category_id: categories[1].id,
        warranty_days: 30,
      },
      {
        name: "Kapasitor Kompressor",
        description: "Perbaikan pada kapasitor untuk kompressor, (penggantian sparepart baru)",
        price: 275000,
        category_id: categories[2].id,
        warranty_days: 30,
      },
      {
        name: "Motor Swing Indoor",
        description: "Perbaikan motor swing indoor yang rusak (penggantian sparepart)",
        price: 150000,
        category_id: categories[2].id,
        warranty_days: 30,
      },
    ];

    await Service.bulkCreate(services);

    console.log("[services] seeded 7 rows");
    process.exit(0);
  } catch (err) {
    console.error("[services] failed:", err.message);
    process.exit(1);
  }
};

run();
