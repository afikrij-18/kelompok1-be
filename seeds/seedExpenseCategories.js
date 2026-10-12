import { db, ExpenseCategory } from "../models/index.js";

const seedExpenseCategories = async () => {
  try {
    await db.authenticate();

    const categories = [
      {
        nama: "Operasional",
        deskripsi: "Biaya operasional usaha",
      },
      {
        nama: "Transportasi",
        deskripsi: "Biaya bensin, parkir, dan perjalanan",
      },
      {
        nama: "Listrik",
        deskripsi: "Tagihan listrik tempat usaha",
      },
      {
        nama: "Peralatan",
        deskripsi: "Pembelian dan penggantian peralatan",
      },
      {
        nama: "Konsumsi",
        deskripsi: "Konsumsi karyawan dan teknisi",
      },
      {
        nama: "Internet",
        deskripsi: "Biaya internet dan komunikasi",
      },
      {
        nama: "Perawatan",
        deskripsi: "Perawatan aset dan peralatan usaha",
      },
    ];

    let created = 0;

    for (const item of categories) {
      const [, wasCreated] = await ExpenseCategory.findOrCreate({
        where: { nama: item.nama },
        defaults: {
          ...item,
          status: "active",
        },
      });

      if (wasCreated) created++;
    }

    console.log(`Seed kategori selesai. Kategori baru: ${created}`);
  } catch (error) {
    console.error("Seed kategori gagal:", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

seedExpenseCategories();
