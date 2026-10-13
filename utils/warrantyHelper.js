import { BookingUnit, Service } from "../models/index.js";

// Helper: terbitkan garansi saat LUNAS + SELESAI
// Set warranty_expiry_date = startDate + service.warranty_days
// Idempoten: skip unit yang sudah punya tanggal garansi
export const issueWarrantyForBooking = async (bookingId, transaction = null, startDate = new Date()) => {
  const opts = transaction ? { where: { booking_id: bookingId }, include: [{ model: Service, as: "service" }], transaction } : { where: { booking_id: bookingId }, include: [{ model: Service, as: "service" }] };
  const units = await BookingUnit.findAll(opts);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  for (const unit of units) {
    if (unit.warranty_expiry_date) continue;
    const days = Number(unit.service?.warranty_days) || 0;
    if (!days || days <= 0) continue;
    const expiry = new Date(start);
    expiry.setDate(expiry.getDate() + days);
    await unit.update({ warranty_expiry_date: expiry.toISOString().slice(0, 10) }, transaction ? { transaction } : {});
  }
  return units.length;
};

// Helper: hitung status garansi satu unit
export const getWarrantyStatus = (unit) => {
  if (!unit?.warranty_expiry_date) {
    return { is_valid: false, days_remaining: 0, reason: "Unit ini tidak memiliki garansi" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(unit.warranty_expiry_date);
  expiry.setHours(0, 0, 0, 0);
  const diffMs = expiry - today;
  const days_remaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffMs < 0) {
    return { is_valid: false, days_remaining: 0, reason: "Garansi sudah habis" };
  }
  return { is_valid: true, days_remaining, reason: null };
};
