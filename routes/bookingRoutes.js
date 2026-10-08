import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking,
  updateBooking,
} from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";


const router = express.Router();

// Semua rute booking dilindungi, HANYA Admin dan Owner yang bisa mengaksesnya
router.get("/bookings", authMiddleware, roleMiddleware, getBookings);
router.get("/bookings/:id", authMiddleware, roleMiddleware, getBookingById);
router.post("/bookings", authMiddleware, roleMiddleware, createBooking);
router.delete("/bookings/:id", authMiddleware, roleMiddleware, deleteBooking);
router.put("/bookings/:id", authMiddleware, roleMiddleware, updateBooking);

export default router;