import { Category, db, Service } from "../models";

const runMasterSeeder = async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil, memulai seeding master data...");

    const t = await db.transaction();

    try {
      // 1. Seed Categories (Master Kategori)
      console.log("Mengisi tabel categories...");
      await Category.bulkCreate([
        { id: 1, name: "Service AC(Updated)", parent_id: null },
        { id: 2, name: "Perbaikan AC", parent_id: null },
        { id: 3, name: "Bongkar Pasang AC", parent_id: null }
      ], { transaction: t, updateOnDuplicate: ["name", "parent_id"] });

      // 2. Seed Services (Master Layanan)
      console.log("Mengisi tabel services...");
      await Service.bulkCreate([
        { id: 1, name: "Service AC Biasa (updated)", description: "Pembersihan standar diperbarui (updated)", price: 96000, category_id: 1 },
        { id: 2, name: "Service AC Extra", description: "Pembersihan menyeluruh dengan cuci steam", price: 180000, category_id: 1 },
        { id: 3, name: "Perbaikan Kapasitor Outdoor", description: "Memperbaiki kapasitor outdoor untuk kompressor", price: 275000, category_id: 2 },
        { id: 4, name: "Perbaikan Fan Indoor", description: "Memperbaiki Fan Indoor", price: 275000, category_id: 2 },
        { id: 5, name: "Bongkar AC Split", description: "Pekerjaan hanya membongkar AC Split", price: 150000, category_id: 3 },
        { id: 6, name: "Pasang AC Split (Baru/Second)", description: "Pekerjaan hanya memasang AC Split baik baru ataupun second. ( Biaya tidak termasuk sparepart tambahan seperti pipa AC)", price: 250000, category_id: 3 }
      ], { transaction: t, updateOnDuplicate: ["name", "description", "price", "category_id"] });

      await t.commit();
      console.log("Seeding master data berhasil dijalankan!");
      process.exit(0);

    } catch (error) {
      await t.rollback();
      console.error("Gagal melakukan seeding master data, transaksi dibatalkan:", error);
      process.exit(1);
    }

  } catch (error) {
    console.error("Koneksi database gagal:", error.message);
    process.exit(1);
  }
};

runMasterSeeder();