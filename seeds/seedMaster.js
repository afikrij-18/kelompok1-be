import { Category, db, Service } from "../models/index.js";

const runMasterSeeder = async () => {
  try {
    await db.authenticate();
    console.log("[master] DB connected, starting master seeding...");

    const t = await db.transaction();

    try {
      // 1. Seed Categories (3 real categories from database)
      const categoriesData = [
        { name: "Service AC" },
        { name: "Installasi" },
        { name: "Perbaikan" },
      ];

      for (const cat of categoriesData) {
        await Category.findOrCreate({
          where: { name: cat.name },
          defaults: cat,
          transaction: t,
        });
      }

      // 2. Seed Services (7 real services from database)
      const servicesData = [
        { name: "Service AC Biasa", description: "Service AC dengan pembersihan standar", price: 90000, category_id: 1, warranty_days: 7 },
        { name: "Service AC Extra", description: "Service AC dengan pembersihan menyeluruh", price: 150000, category_id: 1, warranty_days: 7 },
        { name: "Instalasi AC Baru Split 1 PK", description: "Pemasangan AC baru dengan garansi instalasi", price: 250000, category_id: 2, warranty_days: 30 },
        { name: "Motor Swing Indoor", description: "Perbaikan motor swing indoor AC", price: 150000, category_id: 3, warranty_days: 30 },
        { name: "Kapasitor Outdoor", description: "Penggantian kapasitor outdoor", price: 275000, category_id: 3, warranty_days: 30 },
        { name: "Bongkar Pasang AC", description: "Bongkar dan pasang ulang AC ke lokasi baru", price: 250000, category_id: 2, warranty_days: 30 },
        { name: "Fan Indoor", description: "Perbaikan atau penggantian fan indoor", price: 200000, category_id: 3, warranty_days: 30 },
      ];

      for (const srv of servicesData) {
        const category = await Category.findOne({
          where: { name: categoriesData[srv.category_id - 1].name },
          transaction: t,
        });
        
        await Service.findOrCreate({
          where: { name: srv.name },
          defaults: {
            ...srv,
            category_id: category.id,
          },
          transaction: t,
        });
      }

      await t.commit();
      console.log("[master] Master data seeded successfully! (3 categories + 7 services)");
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
