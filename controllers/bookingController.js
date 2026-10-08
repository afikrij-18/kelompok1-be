import {
  db,
  Customer,
  CustomerAddress,
  BookingService,
  BookingUnit,
  Service,
} from "../models/index.js";

// Helper untuk membuat nomor registrasi unik (contoh: BK-20261008-3176)
const generateRegNo = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BK-${date}-${random}`;
};

// GET - Ambil Semua Data Booking (Lengkap dengan Customer, Alamat, Unit, dan Service)
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingService.findAll({
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: CustomerAddress,
          as: "address", // <-- Alamat spesifik tempat servis dilakukan
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
          model: CustomerAddress,
          as: "address",
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

// POST - Buat Booking Baru (Dengan Alamat Terpisah)
export const createBooking = async (req, res) => {
  const t = await db.transaction(); // Gunakan transaksi agar aman

  try {
    const { customer, booking_date, booking_time, notes, units } = req.body;

    // 1. Validasi input dasar
    if (!customer || !customer.name || !customer.phone) {
      await t.rollback();
      return res.status(400).json({ message: "Data customer (name, phone) wajib diisi" });
    }

    if (!customer.address && !customer.address_id) {
      await t.rollback();
      return res.status(400).json({ message: "Alamat servis wajib diisi (berikan address atau address_id)" });
    }

    if (!booking_date || !booking_time) {
      await t.rollback();
      return res.status(400).json({ message: "Tanggal dan waktu booking wajib diisi" });
    }

    if (!units || !Array.isArray(units) || units.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Minimal harus ada 1 unit AC yang diservis" });
    }

    // 2. Cek atau Buat Customer berdasarkan No Telp
    let existingCustomer = await Customer.findOne({
      where: { phone: customer.phone },
      transaction: t,
    });

    let customerId;
    if (existingCustomer) {
      await existingCustomer.update({ name: customer.name }, { transaction: t });
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await Customer.create(
        { name: customer.name, phone: customer.phone },
        { transaction: t }
      );
      customerId = newCustomer.id;
    }

    // 3. Tangani Alamat Customer (Pilih ID lama atau Buat Baru)
    let addressId;
    if (customer.address_id) {
      const checkAddress = await CustomerAddress.findOne({
        where: { id: customer.address_id, customer_id: customerId },
        transaction: t,
      });
      if (!checkAddress) {
        await t.rollback();
        return res.status(404).json({ message: "Alamat pilihan tidak ditemukan atau bukan milik customer ini" });
      }
      addressId = checkAddress.id;
    } else {
      const newAddress = await CustomerAddress.create(
        {
          customer_id: customerId,
          label: customer.address_label || "Alamat Utama",
          address: customer.address,
          notes_location: customer.notes_location || null,
        },
        { transaction: t }
      );
      addressId = newAddress.id;
    }

    // 4. Validasi Service, Ambil Harga, & Hitung Total Harga Otomatis
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
      calculatedTotalPrice += unitPrice;

      validatedUnits.push({
        ...unit,
        price: unitPrice,
      });
    }

    // 5. Buat Booking Service Master (Beserta address_id dan total_price)
    const reg_no = generateRegNo();
    const newBooking = await BookingService.create(
      {
        reg_no,
        customer_id: customerId,
        address_id: addressId,
        booking_date,
        booking_time,
        status: "pending",
        total_price: calculatedTotalPrice,
        notes: notes || null,
      },
      { transaction: t }
    );

    // 6. Buat Booking Units
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
          price: unit.price,
        },
        { transaction: t }
      );
    }

    await t.commit();

    // Ambil data lengkap untuk response
    const createdBooking = await BookingService.findByPk(newBooking.id, {
      include: [
        { model: Customer, as: "customer" },
        { model: CustomerAddress, as: "address" },
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
    await t.rollback();
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

    await BookingUnit.destroy({ where: { booking_id: id }, transaction: t });
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
  const t = await db.transaction();

  try {
    const { id } = req.params;
    const { customer, booking_date, booking_time, status, notes, units } = req.body;

    const existingBooking = await BookingService.findByPk(id, { transaction: t });
    if (!existingBooking) {
      await t.rollback();
      return res.status(404).json({ message: "Data booking tidak ditemukan" });
    }

    if (!customer || !customer.name || !customer.phone) {
      await t.rollback();
      return res.status(400).json({ message: "Data customer (name, phone) wajib diisi" });
    }

    if (!customer.address && !customer.address_id) {
      await t.rollback();
      return res.status(400).json({ message: "Alamat servis wajib diisi (berikan address atau address_id)" });
    }

    if (!booking_date || !booking_time) {
      await t.rollback();
      return res.status(400).json({ message: "Tanggal dan waktu booking wajib diisi" });
    }

    if (!units || !Array.isArray(units) || units.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Minimal harus ada 1 unit AC yang diservis" });
    }

    // 1. Update data customer
    const customerRecord = await Customer.findByPk(existingBooking.customer_id, { transaction: t });
    if (customerRecord) {
      await customerRecord.update(
        {
          name: customer.name,
          phone: customer.phone,
        },
        { transaction: t }
      );
    }

    // 2. Tangani alamat pada update
    let addressId = existingBooking.address_id;
    if (customer.address_id) {
      const checkAddress = await CustomerAddress.findOne({
        where: { id: customer.address_id, customer_id: customerRecord.id },
        transaction: t,
      });
      if (!checkAddress) {
        await t.rollback();
        return res.status(404).json({ message: "Alamat pilihan tidak ditemukan atau bukan milik customer ini" });
      }
      addressId = checkAddress.id;
    } else if (customer.address) {
      const currentAddressRecord = await CustomerAddress.findByPk(addressId, { transaction: t });
      if (currentAddressRecord) {
        await currentAddressRecord.update(
          {
            address: customer.address,
            label: customer.address_label || currentAddressRecord.label,
            notes_location: customer.notes_location || currentAddressRecord.notes_location,
          },
          { transaction: t }
        );
      } else {
        const newAddress = await CustomerAddress.create(
          {
            customer_id: customerRecord.id,
            label: customer.address_label || "Alamat Utama",
            address: customer.address,
            notes_location: customer.notes_location || null,
          },
          { transaction: t }
        );
        addressId = newAddress.id;
      }
    }

    // 3. Hitung ulang total harga service
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
      calculatedTotalPrice += unitPrice;

      validatedUnits.push({
        ...unit,
        price: unitPrice,
      });
    }

    // 4. Update Master Booking
    await existingBooking.update(
      {
        address_id: addressId,
        booking_date,
        booking_time,
        status: status || existingBooking.status,
        total_price: calculatedTotalPrice,
        notes: notes || null,
      },
      { transaction: t }
    );

    // 5. Update Units
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

    await t.commit();

    const updatedBooking = await BookingService.findByPk(id, {
      include: [
        { model: Customer, as: "customer" },
        { model: CustomerAddress, as: "address" },
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