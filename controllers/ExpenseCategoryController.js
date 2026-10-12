import { Op } from "sequelize";
import { ExpenseCategory, Expense } from "../models/index.js";

const validId = (id) => /^\d+$/.test(String(id)) && Number(id) > 0;

const validate = (body, partial = false) => {
  const errors = {};

  if (!partial || body.nama !== undefined) {
    if (
      typeof body.nama !== "string" ||
      body.nama.trim().length < 2 ||
      body.nama.trim().length > 100
    ) {
      errors.nama = "Nama kategori harus 2-100 karakter";
    }
  }

  if (body.deskripsi !== undefined) {
    if (
      body.deskripsi !== null &&
      (typeof body.deskripsi !== "string" || body.deskripsi.length > 255)
    ) {
      errors.deskripsi = "Deskripsi maksimal 255 karakter";
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

// GET /api/expense-categories
export const getExpenseCategories = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          message: "Status filter tidak valid",
        });
      }
      where.status = status;
    }

    if (search !== undefined) {
      if (typeof search !== "string" || search.length > 100) {
        return res.status(400).json({
          message: "Pencarian tidak valid",
        });
      }

      where.nama = { [Op.like]: `%${search.trim()}%` };
    }

    const categories = await ExpenseCategory.findAll({
      where,
      order: [["nama", "ASC"]],
    });

    const data = await Promise.all(
      categories.map(async (category) => {
        const item = category.toJSON();
        item.jumlah_transaksi = await Expense.count({
          where: { category_id: category.id },
        });
        return item;
      }),
    );

    return res.status(200).json({
      message: "Data kategori berhasil diambil",
      data,
    });
  } catch (error) {
    console.error("getExpenseCategories:", error);
    return res.status(500).json({
      message: "Gagal mengambil kategori",
    });
  }
};

// GET /api/expense-categories/:id
export const getExpenseCategoryById = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const category = await ExpenseCategory.findByPk(req.params.id, {
      include: [
        {
          model: Expense,
          as: "expenses",
          attributes: ["id", "tanggal", "keterangan", "metode", "jumlah"],
          separate: true,
          order: [["tanggal", "DESC"]],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Detail kategori berhasil diambil",
      data: category,
    });
  } catch (error) {
    console.error("getExpenseCategoryById:", error);
    return res.status(500).json({
      message: "Gagal mengambil detail kategori",
    });
  }
};

// POST /api/expense-categories
export const createExpenseCategory = async (req, res) => {
  try {
    const errors = validate(req.body);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors,
      });
    }

    const nama = req.body.nama.trim();
    const existing = await ExpenseCategory.findOne({ where: { nama } });

    if (existing) {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan",
      });
    }

    const category = await ExpenseCategory.create({
      nama,
      deskripsi: req.body.deskripsi?.trim() || null,
      status: req.body.status || "active",
    });

    return res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data: category,
    });
  } catch (error) {
    console.error("createExpenseCategory:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan",
      });
    }

    return res.status(500).json({
      message: "Gagal menambahkan kategori",
    });
  }
};

// PUT /api/expense-categories/:id
export const updateExpenseCategory = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const errors = validate(req.body, true);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors,
      });
    }

    const category = await ExpenseCategory.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const updates = {};

    if (req.body.nama !== undefined) {
      updates.nama = req.body.nama.trim();
    }

    if (req.body.deskripsi !== undefined) {
      updates.deskripsi =
        typeof req.body.deskripsi === "string"
          ? req.body.deskripsi.trim() || null
          : null;
    }

    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }

    await category.update(updates);

    return res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: category,
    });
  } catch (error) {
    console.error("updateExpenseCategory:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan",
      });
    }

    return res.status(500).json({
      message: "Gagal memperbarui kategori",
    });
  }
};

// DELETE /api/expense-categories/:id
export const deleteExpenseCategory = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const category = await ExpenseCategory.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const count = await Expense.count({
      where: { category_id: category.id },
    });

    if (count > 0) {
      return res.status(409).json({
        message:
          "Kategori sudah digunakan. Nonaktifkan kategori agar riwayat tetap terjaga.",
        jumlah_transaksi: count,
      });
    }

    await category.destroy();

    return res.status(200).json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("deleteExpenseCategory:", error);
    return res.status(500).json({
      message: "Gagal menghapus kategori",
    });
  }
};
