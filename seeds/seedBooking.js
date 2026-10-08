
import db from "../config/database.js";
import {
  Customer,
  CustomerAddress,
  BookingService,
  BookingUnit,
  Service,
} from "../models/index.js";

// Helper untuk membuat nomor registrasi unik
const generateRegNo = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BK-${date}-${random}`;
};

// Data Dummy 5 Skenario Booking
const bookingDataSeed = [
  {
    customer: {
      name: "Rizky Pratama",
      phone: "081122334455",
      address_label: "Rumah Utama",
      address: "Jl. M. Hatta No. 12, Padang",
      notes_location: "Cat pagar hitam, dekat warung kelontong",
    },
    booking_date: "2026-10-15",
    booking_time: "09:00:00",
    notes: "Tolong datang pagi hari.",
    units: [
      {
        service_id: 3, // Pastikan ID service ini ada di DB Anda
        brand_ac: "Sharp",
        type_ac: "Split",
        pk: "1/2",
        lokasi: "Kamar Tidur Depan",
        keluhan: "Cuci berkala dan air menetes",
      },
    ],
  },
  {
    customer: {
      name: "Rizky Pratama", // Pelanggan yang sama, tes tambah alamat kantor baru
      phone: "081122334455",
      address_label: "Kantor Cabang",
      address: "Jl. Sudirman No. 88, Padang",
      notes_location: "Lantai 2 ruang manajer",
    },
    booking_date: "2026-10-16",
    booking_time: "13:30:00",
    notes: "Kantor buka sampai pukul 17.00.",
    units: [
      {
        service_id: 1,
        brand_ac: "Daikin",
        type_ac: "Split",
        pk: "1",
        lokasi: "Ruang Kerja",
        keluhan: "Tidak dingin sama sekali",
      },
      {
        service_id: 2,
        brand_ac: "LG",
        type_ac: "Cassette",
        pk: "2",
        lokasi: "Ruang Meeting Utama",
        keluhan: "Berisik saat kompresor nyala",
      },
    ],
  },
  {
    customer: {
      name: "Dewi Lestari",
      phone: "085288990011",
      address_label: "Kontrakan",
      address: "Jl. Khatib Sulaiman Blok C No. 5, Padang",
      notes_location: "Masuk lewat gerbang samping",
    },
    booking_date: "2026-10-18",
    booking_time: "10:00:00",
    notes: "Harap konfirmasi via WhatsApp sebelum berangkat.",
    units: [
      {
        service_id: 1,
        brand_ac: "Samsung",
        type_ac: "Split",
        pk: "1",
        lokasi: "Kamar Utama",
        keluhan: "Remot tidak merespons dan kurang dingin",
      },
    ],
  },
  {
    customer: {
      name: "Hendra Wijaya",
      phone: "081377665544",
      address_label: "Rumah Orang Tua",
      address: "Jl. Veteran No. 101, Padang",
      notes_location: "Rumah cat putih berlantai dua",
    },
    booking_date: "2026-10-20",
    booking_time: "14:00:00",
    notes: "Mohon teknisi membawa tangga karena posisi unit tinggi.",
    units: [
      {
        service_id: 3,
        brand_ac: "Panasonic",
        type_ac: "Split",
        pk: "1",
        lokasi: "Kamar Tamu",
        keluhan: "Perawatan rutin",
      },
      {
        service_id: 2,
        brand_ac: "Sharp",
        type_ac: "Split",
        pk: "1/2",
        lokasi: "Kamar Belakang",
        keluhan: "Freon habis / kurang",
      },
    ],
  },
  {
    customer: {
      name: "Maya Indah",
      phone: "082299887766",
      address_label: "Toko Butik",
      address: "Jl. Permindo No. 14, Pasar Raya, Padang",
      notes_location: "Deretan toko baju lantai dasar",
    },
    booking_date: "2026-10-21",
    booking_time: "11:00:00",
    notes: "Toko buka pukul 10.00 pagi, mohon datang sebelum jam 12 siang.",
    units: [
      {
        service_id: 2,
        brand_ac: "Gree",
        type_ac: "Split",
        pk: "1.5",
        lokasi: "Area Kasir",
        keluhan: "Bocor air parah menggenangi lantai toko",
      },
    ],
  },
];

const runSeeder = async () => {
  try {
    // Autentikasi koneksi database
    await db.authenticate();
    console.log("Database terhubung untuk seeding...");

    for (let i = 0; i < bookingDataSeed.length; i++) {
      const item = bookingDataSeed[i];
      const t = await db.transaction();

      try {
        // 1. Cek atau Buat Customer
        let existingCustomer = await Customer.findOne({
          where: { phone: item.customer.phone },
          transaction: t,
        });

        let customerId;
        if (existingCustomer) {
          await existingCustomer.update({ name: item.customer.name }, { transaction: t });
          customerId = existingCustomer.id;
        } else {
          const newCustomer = await Customer.create(
            { name: item.customer.name, phone: item.customer.phone },
            { transaction: t }
          );
          customerId = newCustomer.id;
        }

        // 2. Buat Alamat Baru di CustomerAddress
        const newAddress = await CustomerAddress.create(
          {
            customer_id: customerId,
            label: item.customer.address_label,
            address: item.customer.address,
            notes_location: item.customer.notes_location,
          },
          { transaction: t }
        );
        const addressId = newAddress.id;

        // 3. Validasi Service & Hitung Total Harga
        let calculatedTotalPrice = 0;
        const validatedUnits = [];

        for (const unit of item.units) {
          const serviceCheck = await Service.findByPk(unit.service_id, { transaction: t });
          if (!serviceCheck) {
            throw new Error(`Service dengan ID ${unit.service_id} tidak ditemukan di database! Periksa kembali ID service.`);
          }

          const unitPrice = serviceCheck.price;
          calculatedTotalPrice += unitPrice;
          validatedUnits.push({ ...unit, price: unitPrice });
        }

        // 4. Buat Master Booking
        const reg_no = generateRegNo();
        const newBooking = await BookingService.create(
          {
            reg_no,
            customer_id: customerId,
            address_id: addressId,
            booking_date: item.booking_date,
            booking_time: item.booking_time,
            status: "pending",
            total_price: calculatedTotalPrice,
            notes: item.notes,
          },
          { transaction: t }
        );

        // 5. Buat Unit Booking
        for (const unit of validatedUnits) {
          await BookingUnit.create(
            {
              booking_id: newBooking.id,
              service_id: unit.service_id,
              brand_ac: unit.brand_ac,
              type_ac: unit.type_ac,
              pk: unit.pk,
              lokasi: unit.lokasi,
              keluhan: unit.keluhan,
              price: unit.price,
            },
            { transaction: t }
          );
        }

        await t.commit();
        console.log(`[SUKSES] Booking ke-${i + 1} berhasil dibuat (Reg No: ${reg_no})`);
      } catch (err) {
        await t.rollback();
        console.error(`[GAGAL] Booking ke-${i + 1} gagal:`, err.message);
      }
    }

    console.log("\nProses Seeding Selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Gagal menjalankan seeder:", error);
    process.exit(1);
  }
};

runSeeder();