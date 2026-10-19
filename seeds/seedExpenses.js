import { db, Expense, ExpenseCategory, User, Bank } from "../models/index.js";

const seedExpenses = async () => {
  try {
    await db.authenticate();

    const user = await User.findOne();

    if (!user) {
      throw new Error("User ID 1 tidak ditemukan");
    }

    const sampleExpenses = [
      {
        tanggal: "2026-10-01",
        category: "Operasional",
        keterangan: "Pembelian alat kebersihan",
        metode: "cash",
        jumlah: 75000,
      },
      {
        tanggal: "2026-10-03",
        category: "Transportasi",
        keterangan: "Bensin kendaraan operasional",
        metode: "cash",
        jumlah: 100000,
      },
      {
        tanggal: "2026-10-05",
        category: "Listrik",
        keterangan: "Pembayaran tagihan listrik",
        metode: "transfer_bank",
        bank_name: "BCA",
        jumlah: 350000,
      },
      {
        tanggal: "2026-10-08",
        category: "Peralatan",
        keterangan: "Pembelian peralatan kerja",
        metode: "qris",
        jumlah: 150000,
      },
    ];

    let created = 0;

    for (const item of sampleExpenses) {
      const category = await ExpenseCategory.findOne({
        where: { nama: item.category },
      });

      if (!category) {
        console.warn(`[expenses] kategori ${item.category} tidak ditemukan`);
        continue;
      }

      let bank = null;
      if (item.bank_name) {
        bank = await Bank.findOne({
          where: { nama: item.bank_name },
        });
      }

      const [, wasCreated] = await Expense.findOrCreate({
        where: {
          tanggal: item.tanggal,
          category_id: category.id,
          keterangan: item.keterangan,
        },
        defaults: {
          category_id: category.id,
          keterangan: item.keterangan,
          tanggal: item.tanggal,
          metode: item.metode,
          bank_id: bank ? bank.id : null,
          jumlah: item.jumlah,
          created_by: user.id,
        },
      });

      if (wasCreated) created++;
    }

    console.log(`[expenses] seeded ${created} rows`);
    process.exit(0);
  } catch (err) {
    console.error("[expenses] failed:", err.message);
    process.exit(1);
  }
};

seedExpenses();
