import {
  db,
  Customer,
  BookingService,
  BookingUnit,
  Service,
} from "../models/index.js";

// Helper untuk membuat nomor registrasi unik (contoh: AC-BOOKING-20261007-XXXX)
const generateRegNo = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BK-${date}-${random}`;
};

// GET - Ambil Semua Data Booking (Lengkap dengan Customer, Unit, dan Service)
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingService.findAll({
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: BookingUnit,
          as: "units",
          include: [
            {
              model: Service,
              as: "service",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Data semua booking berhasil diambil",
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data booking",
      error: error.message,
    });
  }
};

// GET - Ambil Booking Berdasarkan ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingService.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: BookingUnit,
          as: "units",
          include: [
            {
              model: Service,
              as: "service",
            },
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        message: "Data booking tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data booking berhasil diambil",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data booking",
      error: error.message,
    });
  }
};

// POST - Buat Booking Baru (Transaksi Multi-Tabel dengan Total Harga Otomatis)
export const createBooking = async (req, res) => {
  const t = await db.transaction(); // Gunakan transaksi agar aman

  try {
    const { customer, booking_date, booking_time, notes, units } = req.body;

    // 1. Validasi input dasar
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Data customer (name, phone, address) wajib diisi" });
    }

    if (!booking_date || !booking_time) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Tanggal dan waktu booking wajib diisi" });
    }

    if (!units || !Array.isArray(units) || units.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Minimal harus ada 1 unit AC yang diservis" });
    }

    // 2. Cek atau Buat Customer
    let existingCustomer = await Customer.findOne({
      where: { phone: customer.phone },
      transaction: t,
    });

    let customerId;
    if (existingCustomer) {
      await existingCustomer.update(
        {
          name: customer.name,
          address: customer.address,
        },
        { transaction: t },
      );
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await Customer.create(
        {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
        { transaction: t },
      );
      customerId = newCustomer.id;
    }

    // 3. Validasi Service, Ambil Harga, & Hitung Total Harga Otomatis
    let calculatedTotalPrice = 0;
    const validatedUnits = [];

    for (const unit of units) {
      const serviceCheck = await Service.findByPk(unit.service_id, {
        transaction: t,
      });
      if (!serviceCheck) {
        await t.rollback();
        return res.status(404).json({
          message: `Service dengan ID ${unit.service_id} tidak ditemukan`,
        });
      }

      const unitPrice = serviceCheck.price;
      calculatedTotalPrice += unitPrice; // Akumulasi total harga

      validatedUnits.push({
        ...unit,
        price: unitPrice, // Simpan harga per unit
      });
    }

    // 4. Buat Booking Service Master (Beserta total_price)
    const reg_no = generateRegNo();
    const newBooking = await BookingService.create(
      {
        reg_no,
        customer_id: customerId,
        booking_date,
        booking_time,
        status: "pending",
        total_price: calculatedTotalPrice, // <-- Masukkan total keseluruhan harga
        notes: notes || null,
      },
      { transaction: t },
    );

    // 5. Buat Booking Units (Beserta snapshot price masing-masing unit)
    for (const unit of validatedUnits) {
      await BookingUnit.create(
        {
          booking_id: newBooking.id,
          service_id: unit.service_id,
          brand_ac: unit.brand_ac,
          type_ac: unit.type_ac,
          pk: unit.pk,
          lokasi: unit.lokasi,
          keluhan: unit.keluhan || null,
          price: unit.price, // <-- Simpan harga satuan di transaksi unit
        },
        { transaction: t },
      );
    }

    // Jika semua sukses, commit transaksi
    await t.commit();

    // Ambil data lengkap yang baru dibuat untuk dikembalikan sebagai response
    const createdBooking = await BookingService.findByPk(newBooking.id, {
      include: [
        { model: Customer, as: "customer" },
        {
          model: BookingUnit,
          as: "units",
          include: [{ model: Service, as: "service" }],
        },
      ],
    });

    res.status(201).json({
      message: "Booking service berhasil dibuat",
      data: createdBooking,
    });
  } catch (error) {
    await t.rollback(); // Batalkan semua jika ada error
    res.status(500).json({
      message: "Gagal membuat booking service",
      error: error.message,
    });
  }
};

// DELETE - Hapus / Batalkan Booking
export const deleteBooking = async (req, res) => {
  const t = await db.transaction();
  try {
    const { id } = req.params;

    const booking = await BookingService.findByPk(id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    // Hapus unit terkait terlebih dahulu
    await BookingUnit.destroy({ where: { booking_id: id }, transaction: t });

    // Hapus master booking
    await booking.destroy({ transaction: t });

    await t.commit();

    res.status(200).json({
      message: "Booking berhasil dihapus",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message: "Gagal menghapus booking",
      error: error.message,
    });
  }
};

// PUT - Update / Edit Booking Berdasarkan ID
export const updateBooking = async (req, res) => {
  const t = await db.transaction(); // Gunakan transaksi agar aman

  try {
    const { id } = req.params;
    // Menambahkan status ke dalam request body destructuring
    const { customer, booking_date, booking_time, status, notes, units } = req.body;

    // 1. Cek apakah booking yang akan di-edit ada
    const existingBooking = await BookingService.findByPk(id, { transaction: t });
    if (!existingBooking) {
      await t.rollback();
      return res.status(404).json({ message: "Data booking tidak ditemukan" });
    }

    // 2. Validasi input dasar
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Data customer (name, phone, address) wajib diisi" });
    }

    if (!booking_date || !booking_time) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Tanggal dan waktu booking wajib diisi" });
    }

    if (!units || !Array.isArray(units) || units.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Minimal harus ada 1 unit AC yang diservis" });
    }

    // 3. Update data customer berdasarkan customer_id dari booking
    const customerRecord = await Customer.findByPk(existingBooking.customer_id, { transaction: t });
    if (customerRecord) {
      await customerRecord.update(
        {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
        { transaction: t }
      );
    }

    // 4. Validasi Service, Ambil Harga, & Hitung Ulang Total Harga Otomatis
    let calculatedTotalPrice = 0;
    const validatedUnits = [];

    for (const unit of units) {
      const serviceCheck = await Service.findByPk(unit.service_id, {
        transaction: t,
      });
      if (!serviceCheck) {
        await t.rollback();
        return res.status(404).json({
          message: `Service dengan ID ${unit.service_id} tidak ditemukan`,
        });
      }

      const unitPrice = serviceCheck.price;
      calculatedTotalPrice += unitPrice; // Akumulasi total harga baru

      validatedUnits.push({
        ...unit,
        price: unitPrice,
      });
    }

    // 5. Update Master Booking (Termasuk status dan total_price baru)
    await existingBooking.update(
      {
        booking_date,
        booking_time,
        status: status || existingBooking.status, // Update status jika dikirim, jika tidak pertahankan yang lama
        total_price: calculatedTotalPrice,
        notes: notes || null,
      },
      { transaction: t }
    );

    // 6. Strategi Update Unit: Hapus unit lama yang terikat pada booking ini, lalu masukkan unit yang baru
    await BookingUnit.destroy({
      where: { booking_id: id },
      transaction: t,
    });

    for (const unit of validatedUnits) {
      await BookingUnit.create(
        {
          booking_id: existingBooking.id,
          service_id: unit.service_id,
          brand_ac: unit.brand_ac,
          type_ac: unit.type_ac,
          pk: unit.pk,
          lokasi: unit.lokasi,
          keluhan: unit.keluhan || null,
          price: unit.price,
        },
        { transaction: t }
      );
    }

    // Jika semua proses sukses, commit transaksi
    await t.commit();

    // 7. Ambil data booking yang sudah diperbarui beserta relasinya untuk dikembalikan ke response
    const updatedBooking = await BookingService.findByPk(id, {
      include: [
        { model: Customer, as: "customer" },
        {
          model: BookingUnit,
          as: "units",
          include: [{ model: Service, as: "service" }],
        },
      ],
    });

    res.status(200).json({
      message: "Data booking berhasil diperbarui",
      data: updatedBooking,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message: "Gagal memperbarui data booking",
      error: error.message,
    });
  }
};