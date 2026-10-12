import db from "../config/database.js";
import { WarrantyClaim, BookingUnit, User } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    const count = await WarrantyClaim.count();
    if (count > 0) {
      console.log(`[warranty] skipped, already ${count} rows`);
      process.exit(0);
    }
    const unit = await BookingUnit.findOne();
    const user = await User.findOne();
    if (unit && user) {
        await WarrantyClaim.create({
            booking_unit_id: unit.id,
            keluhan: "AC masih bunyi kasar setelah diservis",
            status: "pending",
            created_by: user.id
        });
    }
    console.log("[warranty] seeded sample claim");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();