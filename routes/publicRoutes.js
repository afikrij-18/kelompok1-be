import express from "express";
import {
  getPublicServices,
  createPublicBooking,
  getPublicBookingStatus,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/services", getPublicServices);
router.post("/bookings", createPublicBooking);
router.get("/bookings/status", getPublicBookingStatus);

export default router;
