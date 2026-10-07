// import { db, Customer, BookingService, BookingUnit } from "./models/index.js";

import { BookingService, BookingUnit, Customer, db } from "../models/index.js";

const runBookingSeeder = async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil, memulai seeding transaksi booking...");

    const t = await db.transaction();

    try {
      // 1. Seed / Pastikan Customer ada
      console.log("Menyiapkan data customer...");
      let [customer] = await Customer.findOrCreate({
        where: { phone: "081234567890" },
        defaults: {
          id: 1,
          name: "Ahmad Fikri Jundana",
          address: "Jl. Khatib Sulaiman No. 10, Padang"
        },
        transaction: t
      });

      // 2. Seed Booking Services & Booking Units
      console.log("Mengisi riwayat booking_services & booking_units...");
      
      // Booking 1 (Tanpa harga snapshot / data awal)
      const booking1 = await BookingService.create({
        id: 1,
        reg_no: "BK-20261007-3551",
        status: "pending",
        customer_id: customer.id,
        booking_date: "2026-10-15",
        booking_time: "14:30:00",
        notes: "Tolong teknisi datang tepat waktu dan bawa peralatan lengkap.",
        total_price: 0
      }, { transaction: t });

      await BookingUnit.bulkCreate([
        { brand_ac: "Daikin", type_ac: "Split", pk: "1", lokasi: "Kamar Utama", keluhan: "Kurang dingin dan agak berisik", booking_id: booking1.id, service_id: 1, price: 0 },
        { brand_ac: "Panasonic", type_ac: "Split", pk: "1.5", lokasi: "Ruang Tamu", keluhan: "Air menetes dari bagian indoor", booking_id: booking1.id, service_id: 2, price: 0 }
      ], { transaction: t });

      // Booking 2
      const booking2 = await BookingService.create({
        id: 2,
        reg_no: "BK-20261007-3969",
        status: "pending",
        customer_id: customer.id,
        booking_date: "2026-10-15",
        booking_time: "13:00:00",
        notes: "Tolong cek AC kamar utama yang kurang dingin dan pasang AC di ruang tamu.",
        total_price: 346000
      }, { transaction: t });

      await BookingUnit.bulkCreate([
        { brand_ac: "Daikin", type_ac: "Split", pk: "1", lokasi: "Kamar Utama", keluhan: "Kurang dingin dan sedikit berisik", booking_id: booking2.id, service_id: 1, price: 0 },
        { brand_ac: "Panasonic", type_ac: "Split", pk: "1.5", lokasi: "Ruang Tamu", keluhan: "Pasang unit baru", booking_id: booking2.id, service_id: 6, price: 0 }
      ], { transaction: t });

      // Booking 3 (Dengan snapshot harga lengkap)
      const booking3 = await BookingService.create({
        id: 3,
        reg_no: "BK-20261007-5638",
        status: "pending",
        customer_id: customer.id,
        booking_date: "2026-10-15",
        booking_time: "13:00:00",
        notes: "Tolong cek AC kamar utama yang kurang dingin dan pasang AC di ruang tamu.",
        total_price: 346000
      }, { transaction: t });

      await BookingUnit.bulkCreate([
        { brand_ac: "Daikin", type_ac: "Split", pk: "1", lokasi: "Kamar Utama", keluhan: "Kurang dingin dan sedikit berisik", booking_id: booking3.id, service_id: 1, price: 96000 },
        { brand_ac: "Panasonic", type_ac: "Split", pk: "1.5", lokasi: "Ruang Tamu", keluhan: "Pasang unit baru", booking_id: booking3.id, service_id: 6, price: 250000 }
      ], { transaction: t });

      await t.commit();
      console.log("Seeding transaksi booking berhasil dijalankan!");
      process.exit(0);

    } catch (error) {
      await t.rollback();
      console.error("Gagal melakukan seeding booking, transaksi dibatalkan:", error);
      process.exit(1);
    }

  } catch (error) {
    console.error("Koneksi database gagal:", error.message);
    process.exit(1);
  }
};

runBookingSeeder();