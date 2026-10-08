import db from "../config/database.js";
import { BookingService, BookingUnit, Customer, CustomerAddress, Service } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[bookings] DB connected...");

    const count = await BookingService.count();
    if (count > 0) {
      console.log(`[bookings] skipped, already ${count} rows`);
      process.exit(0);
    }

    const customer = await Customer.findOne();
    const address = await CustomerAddress.findOne({ where: { customer_id: customer?.id || 1 } });
    const service1 = await Service.findByPk(1) || { id: 1, price: 90000 };
    const service2 = await Service.findByPk(2) || { id: 2, price: 175000 };

    if (!customer || !address) {
      console.log("[bookings] seed customers first");
      process.exit(1);
    }

    const total = service1.price + service2.price;

    const booking = await BookingService.create({
      reg_no: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-1001`,
      customer_id: customer.id,
      address_id: address.id,
      booking_date: "2026-10-25",
      booking_time: "09:00:00",
      status: "pending",
      total_price: total,
      notes: "Seed booking sample",
    });

    await BookingUnit.bulkCreate([
      {
        booking_id: booking.id,
        service_id: service1.id,
        brand_ac: "Daikin",
        type_ac: "Split",
        pk: "1",
        lokasi: "Kamar Depan",
        keluhan: "Cuci rutin",
        price: service1.price,
      },
      {
        booking_id: booking.id,
        service_id: service2.id,
        brand_ac: "Panasonic",
        type_ac: "Split",
        pk: "1/2",
        lokasi: "Kamar Belakang",
        keluhan: "Kurang dingin",
        price: service2.price,
      },
    ]);

    console.log(`[bookings] seeded booking id ${booking.id} with 2 units`);
    process.exit(0);
  } catch (err) {
    console.error("[bookings] failed:", err.message);
    process.exit(1);
  }
};

run();
