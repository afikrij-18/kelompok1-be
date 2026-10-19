import { Category, db, Service } from "../models/index.js";

const runMasterSeeder = async () => {
  try {
    await db.authenticate();
    console.log("[master] DB connected, starting master seeding...");

    const t = await db.transaction();

    try {
      // 1. Seed Categories (Flat)
      const categoriesData = [
        { id: 1, name: "Service AC" },
        { id: 2, name: "Perbaikan AC" },
        { id: 3, name: "Bongkar Pasang AC" },
      ];

      for (const cat of categoriesData) {
        await Category.findOrCreate({
          where: { id: cat.id },
          defaults: cat,
          transaction: t,
        });
      }

      // 2. Seed Services
      const servicesData = [
        { id: 1, name: "Service AC Biasa (updated)", description: "Pembersihan standar diperbarui", price: 96000, category_id: 1, warranty_days: 7 },
        { id: 2, name: "Service AC Extra", description: "Pembersihan menyeluruh dengan cuci steam", price: 180000, category_id: 1, warranty_days: 14 },
        { id: 3, name: "Perbaikan Kapasitor Outdoor", description: "Memperbaiki kapasitor outdoor untuk kompressor", price: 275000, category_id: 2, warranty_days: 30 },
        { id: 4, name: "Perbaikan Fan Indoor", description: "Memperbaiki Fan Indoor", price: 275000, category_id: 2, warranty_days: 30 },
        { id: 5, name: "Bongkar AC Split", description: "Pekerjaan hanya membongkar AC Split", price: 150000, category_id: 3, warranty_days: 0 },
        { id: 6, name: "Pasang AC Split (Baru/Second)", description: "Pekerjaan hanya memasang AC Split", price: 250000, category_id: 3, warranty_days: 14 },
      ];

      for (const srv of servicesData) {
        await Service.findOrCreate({
          where: { id: srv.id },
          defaults: srv,
          transaction: t,
        });
      }

      await t.commit();
      console.log("[master] Master data seeded successfully!");
      process.exit(0);
    } catch (error) {
      await t.rollback();
      console.error("[master] Failed, rolled back:", error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("[master] Connection failed:", error.message);
    process.exit(1);
  }
};

runMasterSeeder();
