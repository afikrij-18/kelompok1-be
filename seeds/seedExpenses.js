import { db, Expense, ExpenseCategory, User } from "../models/index.js";

const seedExpenses = async () => {
  try {
    await db.authenticate();

    const user = await User.findByPk(1);

    if (!user) {
      throw new Error("User ID 1 tidak ditemukan");
    }

    const sampleExpenses = [
      {
        tanggal: "2026-10-01",
        category: "Operasional",
        keterangan: "Pembelian alat kebersihan",
        metode: "cash",
        jumlah: "75000",
      },
      {
        tanggal: "2026-10-03",
        category: "Transportasi",
        keterangan: "Bensin kendaraan operasional",
        metode: "cash",
        jumlah: "100000",
      },
      {
        tanggal: "2026-10-05",
        category: "Listrik",
        keterangan: "Pembayaran tagihan listrik",
        metode: "transfer_bank",
        jumlah: "350000",
      },
      {
        tanggal: "2026-10-08",
        category: "Peralatan",
        keterangan: "Pembelian peralatan kerja",
        metode: "qris",
        jumlah: "150000",
      },
    ];

    let created = 0;

    for (const item of sampleExpenses) {
      const category = await ExpenseCategory.findOne({
        where: {
          nama: item.category,
          status: "active",
        },
      });

      if (!category) {
        throw new Error(
          `Kategori aktif "${item.category}" tidak ditemukan. Jalankan seed kategori terlebih dahulu.`,
        );
      }

      const [, wasCreated] = await Expense.findOrCreate({
        where: {
          tanggal: item.tanggal,
          category_id: category.id,
          keterangan: item.keterangan,
        },
        defaults: {
          tanggal: item.tanggal,
          category_id: category.id,
          keterangan: item.keterangan,
          metode: item.metode,
          jumlah: item.jumlah,
          created_by: user.id,
        },
      });

      if (wasCreated) created++;
    }

    console.log(`Seed pengeluaran selesai. Data baru: ${created}`);
  } catch (error) {
    console.error("Seed pengeluaran gagal:", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

seedExpenses();
