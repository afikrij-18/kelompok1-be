import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
  updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/bookings", getBookings);
router.get("/bookings/:id", getBookingById);
router.post("/bookings", createBooking);
router.delete("/bookings/:id", deleteBooking);
router.put("/bookings/:id", updateBooking);

export default router;
