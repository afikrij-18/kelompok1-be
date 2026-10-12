import { BookingUnit, Service } from "../models/index.js";

// Helper: terbitkan garansi saat booking completed
// Set warranty_expiry_date = tanggal completed + service.warranty_days
// Idempoten: skip unit yang sudah punya tanggal garansi
export const issueWarrantyForBooking = async (bookingId, transaction = null) => {
  const options = transaction ? { where: { booking_id: bookingId }, include: [{ model: Service, as: "service" }], transaction } : { where: { booking_id: bookingId }, include: [{ model: Service, as: "service" }] };
  const units = await BookingUnit.findAll(options);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const unit of units) {
    if (unit.warranty_expiry_date) continue; // idempoten
    const days = unit.service?.warranty_days ?? 0;
    if (!days || days <= 0) continue;
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + Number(days));
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
