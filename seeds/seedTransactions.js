import db from "../config/database.js";
import { BookingService, Transaction, User, Bank } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[transactions] DB connected...");

    const count = await Transaction.count();
    if (count > 0) {
      console.log(`[transactions] skipped, already ${count} rows`);
      process.exit(0);
    }

    // Ambil booking yang completed (Heri's booking)
    const booking = await BookingService.findOne({ where: { status: "completed" } });
    const admin = await User.findOne({ where: { role: "admin" } });
    const bank = await Bank.findOne();

    if (!booking) {
      console.log("[transactions] seed bookings first");
      process.exit(1);
    }

    await Transaction.create({
      booking_id: booking.id,
      invoice_no: "INV-202610-3186",
      payment_method: "cash",
      bank_id: bank ? bank.id : null,
      amount_paid: 250000,
      payment_status: "paid",
      payment_date: "2026-10-19 21:27:27.255",
      created_by: admin ? admin.id : 108,
    });

    console.log("[transactions] seeded 1 transaction");
    process.exit(0);
  } catch (err) {
    console.error("[transactions] failed:", err.message);
    process.exit(1);
  }
};

run();
