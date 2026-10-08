import db from "../config/database.js";
import { Customer, CustomerAddress } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[customers] DB connected...");

    const count = await Customer.count();
    if (count > 0) {
      console.log(`[customers] skipped, already ${count} rows`);
      process.exit(0);
    }

    const c1 = await Customer.create({ name: "Budi Pratama", phone: "081234567801" });
    const c2 = await Customer.create({ name: "Siti Rahma", phone: "081234567802" });

    await CustomerAddress.bulkCreate([
      { customer_id: c1.id, label: "Rumah", address: "Jl. Sudirman No. 10", notes_location: "Pagar hitam" },
      { customer_id: c1.id, label: "Kantor", address: "Jl. Thamrin Kav 5", notes_location: "Lt 3" },
      { customer_id: c2.id, label: "Rumah Utama", address: "Jl. Gatot Subroto No. 44", notes_location: null },
    ]);

    console.log("[customers] seeded 2 customers + 3 addresses");
    process.exit(0);
  } catch (err) {
    console.error("[customers] failed:", err.message);
    process.exit(1);
  }
};

run();
