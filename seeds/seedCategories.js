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

    const categories = [
      { name: "Service AC" },
      { name: "Perbaikan AC" },
      { name: "Bongkar Pasang AC" },
      { name: "Cuci AC" },
      { name: "Pengecekan Freon" },
      { name: "Instalasi Pipa" },
      { name: "Service Kulkas" },
      { name: "Service Mesin Cuci" },
      { name: "Perbaikan Modul" },
      { name: "Pengelasan Pipa" },
      { name: "Service Pompa Air" },
      { name: "Isi Freon" },
      { name: "Pembersihan Evaporator" },
      { name: "Perbaikan Kelistrikan" },
      { name: "General Checkup" },
    ];

    await Category.bulkCreate(categories);

    console.log("[categories] seeded 15 rows");
    process.exit(0);
  } catch (err) {
    console.error("[categories] failed:", err.message);
    process.exit(1);
  }
};

run();
