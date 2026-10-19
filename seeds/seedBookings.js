import db from "../config/database.js";
import {
  BookingService,
  BookingUnit,
  Customer,
  CustomerAddress,
  Service,
  Technician,
  User,
} from "../models/index.js";

const generateRegNo = (index) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `BK-${date}-${1001 + index}`;
};

const run = async () => {
  try {
    await db.authenticate();
    console.log("[bookings] DB connected...");

    const count = await BookingService.count();
    if (count > 0) {
      console.log(`[bookings] skipped, already ${count} rows`);
      process.exit(0);
    }

    const services = await Service.findAll();
    if (services.length < 3) {
      console.error("[bookings] seed services first!");
      process.exit(1);
    }

    const s1 = services[0].id;
    const s2 = services[1].id;
    const s3 = services[2].id;

    const bookingDataSeed = [
      {
        status: "confirmed",
        customer: {
          name: "Customer Test",
          phone: "08999999999",
          address_label: "Rumah Utama",
          address: "Jl. Testing No. 1, Padang",
          notes_location: "Cat rumah warna oranye dekat tiang listrik",
        },
        booking_date: "2026-10-20",
        booking_time: "10:00:00",
        notes: "Mohon teknisi datang tepat waktu.",
        units: [
          { service_id: s1, brand_ac: "Sharp", type_ac: "Split", pk: "1/2", lokasi: "Ruang Tamu", keluhan: "Kurang dingin" },
          { service_id: s2, brand_ac: "Panasonic", type_ac: "Split", pk: "1", lokasi: "Kamar Tidur Utama", keluhan: "Air menetes dari indoor" },
        ],
      },
      {
        status: "pending",
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
          { service_id: s3, brand_ac: "Sharp", type_ac: "Split", pk: "1/2", lokasi: "Kamar Tidur Depan", keluhan: "Cuci berkala dan air menetes" },
        ],
      },
      {
        status: "pending",
        customer: {
          name: "Rizky Pratama",
          phone: "081122334455",
          address_label: "Kantor Cabang",
          address: "Jl. Sudirman No. 88, Padang",
          notes_location: "Lantai 2 ruang manajer",
        },
        booking_date: "2026-10-16",
        booking_time: "13:30:00",
        notes: "Kantor buka sampai pukul 17.00.",
        units: [
          { service_id: s1, brand_ac: "Daikin", type_ac: "Split", pk: "1", lokasi: "Ruang Kerja", keluhan: "Tidak dingin sama sekali" },
          { service_id: s2, brand_ac: "LG", type_ac: "Cassette", pk: "2", lokasi: "Ruang Meeting Utama", keluhan: "Berisik saat kompresor nyala" },
        ],
      },
      {
        status: "pending",
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
          { service_id: s1, brand_ac: "Samsung", type_ac: "Split", pk: "1", lokasi: "Kamar Utama", keluhan: "Remot tidak merespons dan kurang dingin" },
        ],
      },
      {
        status: "pending",
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
          { service_id: s3, brand_ac: "Panasonic", type_ac: "Split", pk: "1", lokasi: "Kamar Tamu", keluhan: "Perawatan rutin" },
          { service_id: s2, brand_ac: "Sharp", type_ac: "Split", pk: "1/2", lokasi: "Kamar Belakang", keluhan: "Freon habis / kurang" },
        ],
      },
      {
        status: "pending",
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
          { service_id: s2, brand_ac: "Gree", type_ac: "Split", pk: "1.5", lokasi: "Area Kasir", keluhan: "Bocor air parah menggenangi lantai toko" },
        ],
      },
    ];

    const technician = await Technician.findOne({ where: { status: "active" } });
    const admin = await User.findOne({ where: { role: "admin" } });

    for (let i = 0; i < bookingDataSeed.length; i++) {
      const item = bookingDataSeed[i];
      const t = await db.transaction();

      try {
        let customer = await Customer.findOne({
          where: { phone: item.customer.phone },
          transaction: t,
        });

        let customerId;
        if (customer) {
          await customer.update({ name: item.customer.name }, { transaction: t });
          customerId = customer.id;
        } else {
          const newCustomer = await Customer.create(
            { name: item.customer.name, phone: item.customer.phone },
            { transaction: t }
          );
          customerId = newCustomer.id;
        }

        const address = await CustomerAddress.create(
          {
            customer_id: customerId,
            label: item.customer.address_label,
            address: item.customer.address,
            notes_location: item.customer.notes_location || null,
          },
          { transaction: t }
        );

        let totalPrice = 0;
        const validatedUnits = [];
        for (const unit of item.units) {
          const service = await Service.findByPk(unit.service_id, { transaction: t });
          if (!service) {
            throw new Error(`Service ID ${unit.service_id} tidak ditemukan`);
          }
          totalPrice += service.price;
          validatedUnits.push({ ...unit, price: service.price });
        }

        const reg_no = generateRegNo(i);
        const booking = await BookingService.create(
          {
            reg_no,
            customer_id: customerId,
            address_id: address.id,
            technician_id: item.status === "confirmed" && technician ? technician.id : null,
            created_by: admin ? admin.id : 1,
            booking_date: item.booking_date,
            booking_time: item.booking_time,
            status: item.status,
            total_price: totalPrice,
            notes: item.notes,
          },
          { transaction: t }
        );

        for (const unit of validatedUnits) {
          await BookingUnit.create(
            {
              booking_id: booking.id,
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
        console.log(`[bookings] seeded booking ${reg_no} (status: ${item.status})`);
      } catch (err) {
        await t.rollback();
        console.error(`[bookings] failed booking ${i + 1}:`, err.message);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("[bookings] failed:", err.message);
    process.exit(1);
  }
};

run();
