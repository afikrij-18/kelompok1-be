import { WarrantyClaim, BookingUnit, BookingService, Service, User } from "../models/index.js";
import { getWarrantyStatus } from "../utils/warrantyHelper.js";

const VALID_STATUSES = ["pending", "approved", "rejected", "in_progress", "completed"];

const claimIncludes = () => [
  {
    model: BookingUnit,
    as: "unit",
    include: [
      { model: Service, as: "service" },
      { model: BookingService, as: "booking" },
    ],
  },
  { model: User, as: "creator", attributes: ["id", "name", "email"] },
  { model: User, as: "handler", attributes: ["id", "name", "email"] },
];

export const checkWarranty = async (req, res) => {
  try {
    // Dukung dua bentuk: /check/:id dan /check?booking_unit_id=...
    const booking_unit_id = req.params.id || req.query.booking_unit_id;
    if (!booking_unit_id) return res.status(400).json({ message: "booking_unit_id diperlukan" });
    const unit = await BookingUnit.findByPk(booking_unit_id, {
      include: [
        { model: BookingService, as: "booking" },
        { model: Service, as: "service" },
      ],
    });
    if (!unit) return res.status(404).json({ message: "Unit tidak ditemukan" });
    const status = getWarrantyStatus(unit);
    res.status(200).json({
      message: "Status garansi berhasil diambil",
      data: {
        booking_unit_id: unit.id,
        booking_id: unit.booking_id,
        booking_status: unit.booking?.status || null,
        service: unit.service ? { id: unit.service.id, name: unit.service.name, warranty_days: unit.service.warranty_days } : null,
        warranty_expiry_date: unit.warranty_expiry_date,
        ...status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengecek garansi", error: error.message });
  }
};

export const createClaim = async (req, res) => {
  try {
    const { booking_unit_id, keluhan, claim_date } = req.body;
    if (!booking_unit_id) return res.status(400).json({ message: "booking_unit_id wajib diisi" });
    if (!keluhan || String(keluhan).trim().length < 3)
      return res.status(400).json({ message: "keluhan wajib diisi (minimal 3 karakter)" });
    const unit = await BookingUnit.findByPk(booking_unit_id, { include: [{ model: BookingService, as: "booking" }, { model: Service, as: "service" }] });
    if (!unit) return res.status(404).json({ message: "Unit tidak ditemukan" });
    if (unit.booking.status !== "completed") return res.status(400).json({ message: "Booking belum selesai (status harus completed)" });

    const status = getWarrantyStatus(unit);
    if (!status.is_valid) return res.status(400).json({ message: status.reason });

    const claim = await WarrantyClaim.create({
      booking_unit_id,
      keluhan: String(keluhan).trim(),
      claim_date: claim_date || new Date().toISOString().slice(0, 10),
      created_by: req.user.id,
    });

    const result = await WarrantyClaim.findByPk(claim.id, { include: claimIncludes() });
    res.status(201).json({ message: "Klaim berhasil diajukan", data: result });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengajukan klaim", error: error.message });
  }
};

export const getClaims = async (req, res) => {
  try {
    const claims = await WarrantyClaim.findAll({
      include: claimIncludes(),
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ message: "Data klaim garansi berhasil diambil", data: claims });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data klaim", error: error.message });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await WarrantyClaim.findByPk(id, { include: claimIncludes() });
    if (!claim) return res.status(404).json({ message: "Klaim tidak ditemukan" });
    res.status(200).json({ message: "Detail klaim berhasil diambil", data: claim });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail klaim", error: error.message });
  }
};

export const updateClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution_notes, handled_by } = req.body;
    const claim = await WarrantyClaim.findByPk(id);
    if (!claim) return res.status(404).json({ message: "Klaim tidak ditemukan" });

    if (status !== undefined && !VALID_STATUSES.includes(status))
      return res.status(400).json({ message: `status harus salah satu: ${VALID_STATUSES.join(", ")}` });

    await claim.update({
      status: status ?? claim.status,
      resolution_notes: resolution_notes !== undefined ? resolution_notes : claim.resolution_notes,
      handled_by: handled_by ?? req.user.id,
    });

    const result = await WarrantyClaim.findByPk(id, { include: claimIncludes() });
    res.status(200).json({ message: "Klaim berhasil diperbarui", data: result });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui klaim", error: error.message });
  }
};

export const deleteClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await WarrantyClaim.findByPk(id);
    if (!claim) return res.status(404).json({ message: "Klaim tidak ditemukan" });
    await claim.destroy();
    res.status(200).json({ message: "Klaim berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus klaim", error: error.message });
  }
};
