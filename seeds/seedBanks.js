import db from "../config/database.js";
import { Bank } from "../models/index.js";

const seedBanks = async () => {
  try {
    await db.authenticate();
    console.log("[banks] DB connected...");

    const count = await Bank.count();
    if (count > 0) {
      console.log(`[banks] skipped, already ${count} rows`);
      process.exit(0);
    }

    const banks = [
      { nama: "BCA", no_rekening: "1234567890", atas_nama: "CV Service AC Sumbar", status: "active" },
      { nama: "Mandiri", no_rekening: "0987654321", atas_nama: "CV Service AC Sumbar", status: "active" },
      { nama: "BRI", no_rekening: "1122334455", atas_nama: "CV Service AC Sumbar", status: "active" },
      { nama: "QRIS", no_rekening: "QRIS-MAIN", atas_nama: "CV Service AC Sumbar", status: "active" },
    ];

    await Bank.bulkCreate(banks);

    console.log("[banks] seeded 4 banks");
    process.exit(0);
  } catch (err) {
    console.error("[banks] failed:", err.message);
    process.exit(1);
  }
};

seedBanks();
