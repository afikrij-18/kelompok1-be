import db from "../config/database.js";
import { BookingService, Transaction, User } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[transactions] DB connected...");

    const count = await Transaction.count();
    if (count > 0) {
      console.log(`[transactions] skipped, already ${count} rows`);
      process.exit(0);
    }

    const booking = await BookingService.findOne();
    const admin = await User.findOne({ where: { role: "admin" } });

    if (!booking) {
      console.log("[transactions] seed bookings first");
      process.exit(1);
    }

    await Transaction.create({
      booking_id: booking.id,
      invoice_no: `INV-${new Date().toISOString().slice(0, 7).replace("-", "")}-1001`,
      payment_method: "cash",
      amount_paid: booking.total_price,
      payment_status: "paid",
      payment_date: new Date(),
      notes: "Pembayaran lunas tunai via seeder",
      created_by: admin ? admin.id : null,
    });

    console.log(`[transactions] seeded transaction for booking ${booking.id}`);
    process.exit(0);
  } catch (err) {
    console.error("[transactions] failed:", err.message);
    process.exit(1);
  }
};

run();
