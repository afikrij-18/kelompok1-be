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
    if (services.length === 0) {
      console.error("[bookings] seed services first!");
      process.exit(1);
    }

    const customers = await Customer.findAll();
    if (customers.length === 0) {
      console.error("[bookings] seed customers first!");
      process.exit(1);
    }

    const technicians = await Technician.findAll();
    if (technicians.length === 0) {
      console.error("[bookings] seed technicians first!");
      process.exit(1);
    }

    const addresses = await CustomerAddress.findAll();
    if (addresses.length === 0) {
      console.error("[bookings] seed customers first!");
      process.exit(1);
    }

    // Booking 1: Heri's booking (completed)
    const booking1 = await BookingService.create({
      reg_no: "BK-20261019-7455",
      status: "completed",
      customer_id: customers.find(c => c.name === "Heri").id,
      booking_date: "2026-10-21",
      booking_time: "10:00:00",
      total_price: 250000,
      customer_name_snapshot: "Heri",
      technician_id: technicians.find(t => t.name === "Budi").id,
      address_id: addresses.find(a => a.customer_id === customers.find(c => c.name === "Heri").id).id,
    });

    await BookingUnit.create({
      brand_ac: "Panasonic",
      type_ac: "Split Wall",
      pk: "1",
      lokasi: "Kamar anak",
      price: 250000,
      booking_id: booking1.id,
      service_id: services.find(s => s.name === "Bongkar Pasang AC").id,
      warranty_expiry_date: "2026-11-18",
    });

    // Booking 2: Felix's booking (confirmed)
    const booking2 = await BookingService.create({
      reg_no: "BK-20261019-1549",
      status: "confirmed",
      customer_id: customers.find(c => c.name === "Felix").id,
      booking_date: "2026-10-20",
      booking_time: "09:00:00",
      total_price: 90000,
      technician_id: technicians.find(t => t.name === "Andi").id,
      created_by: 108,
      address_id: addresses.find(a => a.customer_id === customers.find(c => c.name === "Felix").id).id,
    });

    await BookingUnit.create({
      brand_ac: "Daikin",
      type_ac: "Split Wall",
      pk: "1",
      lokasi: "kamar depan",
      price: 90000,
      booking_id: booking2.id,
      service_id: services.find(s => s.name === "Service AC Biasa").id,
    });

    console.log("[bookings] seeded 2 bookings with units");
    process.exit(0);
  } catch (err) {
    console.error("[bookings] failed:", err.message);
    process.exit(1);
  }
};

run();
