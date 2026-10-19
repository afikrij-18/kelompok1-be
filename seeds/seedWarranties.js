import db from "../config/database.js";
import { WarrantyClaim, BookingUnit, User, BookingService } from "../models/index.js";
import { issueWarrantyForBooking } from "../utils/warrantyHelper.js";

const run = async () => {
  try {
    await db.authenticate();
    const count = await WarrantyClaim.count();
    if (count > 0) {
      console.log(`[warranty] skipped, already ${count} rows`);
      process.exit(0);
    }

    // Cari booking pertama, update status jadi completed supaya garansi bisa diterbitkan
    const booking = await BookingService.findOne();
    if (booking) {
      await booking.update({ status: "completed" });
      await issueWarrantyForBooking(booking.id, null, new Date());
    }

    const unit = await BookingUnit.findOne({ where: { warranty_expiry_date: { [db.Sequelize.Op.ne]: null } } }) || await BookingUnit.findOne();
    const user = await User.findOne();

    if (unit && user) {
      await WarrantyClaim.create({
        booking_unit_id: unit.id,
        keluhan: "AC masih bunyi kasar setelah diservis",
        status: "pending",
        created_by: user.id,
      });
      console.log(`[warranty] seeded sample claim for unit ${unit.id}`);
    } else {
      console.log("[warranty] no unit found to claim");
    }

    process.exit(0);
  } catch (err) {
    console.error("[warranty] failed:", err.message);
    process.exit(1);
  }
};

run();
