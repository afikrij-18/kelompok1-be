import { Op } from "sequelize";
import { Bank, Expense, Transaction } from "../models/index.js";

const validId = (id) => /^\d+$/.test(String(id)) && Number(id) > 0;

const validate = (body, partial = false) => {
  const errors = {};

  if (!partial || body.nama !== undefined) {
    if (
      typeof body.nama !== "string" ||
      body.nama.trim().length < 2 ||
      body.nama.trim().length > 100
    ) {
      errors.nama = "Nama bank harus 2-100 karakter";
    }
  }

  if (body.no_rekening !== undefined && body.no_rekening !== null) {
    if (
      typeof body.no_rekening !== "string" ||
      body.no_rekening.trim().length > 50
    ) {
      errors.no_rekening = "No. rekening maksimal 50 karakter";
    }
  }

  if (body.atas_nama !== undefined && body.atas_nama !== null) {
    if (
      typeof body.atas_nama !== "string" ||
      body.atas_nama.trim().length > 100
    ) {
      errors.atas_nama = "Atas nama maksimal 100 karakter";
    }
  }

  if (
    body.status !== undefined &&
    !["active", "inactive"].includes(body.status)
  ) {
    errors.status = "Status harus active atau inactive";
  }

  if (partial && Object.keys(body).length === 0) {
    errors.body = "Minimal satu field harus dikirim";
  }

  return errors;
};

// GET /api/banks?search=&status=active
export const getBanks = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (status !== undefined && status !== "") {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Status filter tidak valid" });
      }
      where.status = status;
    }

    if (search !== undefined && search !== "") {
      if (typeof search !== "string" || search.length > 100) {
        return res.status(400).json({ message: "Pencarian tidak valid" });
      }
      const like = `%${search.trim()}%`;
      where[Op.or] = [
        { nama: { [Op.like]: like } },
        { no_rekening: { [Op.like]: like } },
        { atas_nama: { [Op.like]: like } },
      ];
    }

    const banks = await Bank.findAll({ where, order: [["nama", "ASC"]] });

    const data = await Promise.all(
      banks.map(async (bank) => {
        const item = bank.toJSON();
        const [jmlExpense, jmlTrx] = await Promise.all([
          Expense.count({ where: { bank_id: bank.id } }),
          Transaction.count({ where: { bank_id: bank.id } }),
        ]);
        item.jumlah_transaksi = jmlExpense + jmlTrx;
        return item;
      })
    );

    return res.status(200).json({ message: "Daftar bank berhasil diambil", data });
  } catch (error) {
    console.error("getBanks:", error);
    return res.status(500).json({ message: "Gagal mengambil daftar bank" });
  }
};

// POST /api/banks
export const createBank = async (req, res) => {
  try {
    const errors = validate(req.body);

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validasi gagal", errors });
    }

    const nama = req.body.nama.trim();
    const existing = await Bank.findOne({ where: { nama } });

    if (existing) {
      return res.status(409).json({ message: "Nama bank sudah digunakan" });
    }

    const bank = await Bank.create({
      nama,
      no_rekening: req.body.no_rekening?.trim() || null,
      atas_nama: req.body.atas_nama?.trim() || null,
      status: req.body.status || "active",
    });

    return res.status(201).json({ message: "Bank berhasil ditambahkan", data: bank });
  } catch (error) {
    console.error("createBank:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Nama bank sudah digunakan" });
    }

    return res.status(500).json({ message: "Gagal menambahkan bank" });
  }
};

// PUT /api/banks/:id
export const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ message: "ID tidak valid" });

    const errors = validate(req.body, true);

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validasi gagal", errors });
    }

    const bank = await Bank.findByPk(id);
    if (!bank) return res.status(404).json({ message: "Bank tidak ditemukan" });

    const updates = {};

    if (req.body.nama !== undefined) {
      const nama = req.body.nama.trim();
      const existing = await Bank.findOne({
        where: { nama, id: { [Op.ne]: bank.id } },
      });
      if (existing) {
        return res.status(409).json({ message: "Nama bank sudah digunakan" });
      }
      updates.nama = nama;
    }

    if (req.body.no_rekening !== undefined) {
      updates.no_rekening =
        typeof req.body.no_rekening === "string"
          ? req.body.no_rekening.trim() || null
          : null;
    }

    if (req.body.atas_nama !== undefined) {
      updates.atas_nama =
        typeof req.body.atas_nama === "string"
          ? req.body.atas_nama.trim() || null
          : null;
    }

    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }

    await bank.update(updates);

    return res.status(200).json({ message: "Bank berhasil diperbarui", data: bank });
  } catch (error) {
    console.error("updateBank:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Nama bank sudah digunakan" });
    }

    return res.status(500).json({ message: "Gagal memperbarui bank" });
  }
};

// DELETE /api/banks/:id
export const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ message: "ID tidak valid" });

    const bank = await Bank.findByPk(id);
    if (!bank) return res.status(404).json({ message: "Bank tidak ditemukan" });

    const [jmlExpense, jmlTrx] = await Promise.all([
      Expense.count({ where: { bank_id: bank.id } }),
      Transaction.count({ where: { bank_id: bank.id } }),
    ]);
    const total = jmlExpense + jmlTrx;

    if (total > 0) {
      return res.status(409).json({
        message:
          "Bank sudah digunakan di transaksi. Nonaktifkan bank agar riwayat tetap terjaga.",
        jumlah_transaksi: total,
      });
    }

    await bank.destroy();
    return res.status(200).json({ message: "Bank berhasil dihapus" });
  } catch (error) {
    console.error("deleteBank:", error);
    return res.status(500).json({ message: "Gagal menghapus bank" });
  }
};
