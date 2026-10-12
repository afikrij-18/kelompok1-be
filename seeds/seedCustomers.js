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

    const customers = [];
    for (let i = 1; i <= 15; i++) {
      customers.push({
        name: `Pelanggan ${i}`,
        phone: `0812345679${i < 10 ? '0' + i : i}`,
      });
    }

    const createdCustomers = await Customer.bulkCreate(customers);

    const addresses = createdCustomers.map((c, i) => ({
      customer_id: c.id,
      label: i % 2 === 0 ? "Rumah" : "Kantor",
      address: `Jl. Contoh No. ${i + 1}, Kota Jakarta`,
      notes_location: `Patokan dekat gedung ${i + 1}`,
    }));

    await CustomerAddress.bulkCreate(addresses);

    console.log("[customers] seeded 15 customers + 15 addresses");
    process.exit(0);
  } catch (err) {
    console.error("[customers] failed:", err.message);
    process.exit(1);
  }
};

run();
