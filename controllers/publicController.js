import { db, Customer, CustomerAddress, BookingService, BookingUnit, Service, Technician, Transaction, Bank, Category } from "../models/index.js";

// GET /public/services — daftar layanan untuk homepage & form publik
export const getPublicServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ message: "Data service berhasil diambil", data: services });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data service", error: error.message });
  }
};

const generateRegNo = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BK-${date}-${random}`;
};

// POST /public/bookings — booking oleh pelanggan tanpa login, status pending
export const createPublicBooking = async (req, res) => {
  const t = await db.transaction();
  try {
    const { customer, booking_date, booking_time, notes, units } = req.body;

    if (!customer || !customer.name || !customer.phone) {
      await t.rollback();
      return res.status(400).json({ message: "Data customer (name, phone) wajib diisi" });
    }
    if (!customer.address && !customer.address_id) {
      await t.rollback();
      return res.status(400).json({ message: "Alamat servis wajib diisi" });
    }
    if (!booking_date || !booking_time) {
      await t.rollback();
      return res.status(400).json({ message: "Tanggal dan waktu booking wajib diisi" });
    }
    if (!units || !Array.isArray(units) || units.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Minimal harus ada 1 unit AC yang diservis" });
    }

    // customer: cari by phone, jangan timpa nama lama — keep histori booking sebelumnya
    let existingCustomer = await Customer.findOne({ where: { phone: customer.phone }, transaction: t });
    let customerId;
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await Customer.create({ name: customer.name, phone: customer.phone }, { transaction: t });
      customerId = newCustomer.id;
    }

    let addressId;
    if (customer.address_id) {
      const checkAddress = await CustomerAddress.findOne({ where: { id: customer.address_id, customer_id: customerId }, transaction: t });
      if (!checkAddress) {
        await t.rollback();
        return res.status(404).json({ message: "Alamat pilihan tidak ditemukan atau bukan milik customer ini" });
      }
      addressId = checkAddress.id;
    } else {
      const newAddress = await CustomerAddress.create(
        { customer_id: customerId, label: customer.address_label || "Alamat Utama", address: customer.address, notes_location: customer.notes_location || null },
        { transaction: t }
      );
      addressId = newAddress.id;
    }

    let calculatedTotalPrice = 0;
    const validatedUnits = [];
    for (const unit of units) {
      const serviceCheck = await Service.findByPk(unit.service_id, { transaction: t });
      if (!serviceCheck) {
        await t.rollback();
        return res.status(404).json({ message: `Service dengan ID ${unit.service_id} tidak ditemukan` });
      }
      const unitPrice = serviceCheck.price;
      calculatedTotalPrice += unitPrice;
      validatedUnits.push({ ...unit, price: unitPrice });
    }

    const reg_no = generateRegNo();
    const newBooking = await BookingService.create(
      { reg_no, customer_id: customerId, customer_name_snapshot: customer.name.trim(), address_id: addressId, technician_id: null, booking_date, booking_time, status: "pending", total_price: calculatedTotalPrice, notes: notes || null, created_by: null },
      { transaction: t }
    );

    for (const unit of validatedUnits) {
      await BookingUnit.create(
        { booking_id: newBooking.id, service_id: unit.service_id, brand_ac: unit.brand_ac, type_ac: unit.type_ac, pk: unit.pk, lokasi: unit.lokasi, keluhan: unit.keluhan || null, price: unit.price },
        { transaction: t }
      );
    }

    await t.commit();

    const createdBooking = await BookingService.findByPk(newBooking.id, {
      include: [
        { model: Customer, as: "customer" },
        { model: CustomerAddress, as: "address" },
        { model: Technician, as: "technician" },
        { model: BookingUnit, as: "units", include: [{ model: Service, as: "service" }] },
        { model: Transaction, as: "transactions", include: [{ model: Bank, as: "bank_ref" }] },
      ],
    });

    res.status(201).json({ message: "Booking service berhasil dibuat", data: createdBooking });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Gagal membuat booking service", error: error.message });
  }
};

// GET /public/bookings/status?reg_no= — cek status booking oleh pelanggan
export const getPublicBookingStatus = async (req, res) => {
  try {
    const { reg_no } = req.query;
    if (!reg_no) {
      return res.status(400).json({ message: "reg_no wajib diisi" });
    }

    const booking = await BookingService.findOne({
      where: { reg_no: String(reg_no).trim().toUpperCase() },
      include: [
        { model: Customer, as: "customer" },
        { model: CustomerAddress, as: "address" },
        { model: Technician, as: "technician" },
        { model: BookingUnit, as: "units", include: [{ model: Service, as: "service" }] },
        { model: Transaction, as: "transactions", include: [{ model: Bank, as: "bank_ref" }] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    res.status(200).json({ message: "Data booking berhasil diambil", data: booking });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data booking", error: error.message });
  }
};
