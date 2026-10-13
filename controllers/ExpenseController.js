import { Op } from "sequelize";
import { Expense, ExpenseCategory, User, Bank } from "../models/index.js";

const METHODS = ["cash", "transfer_bank", "qris"];

const validId = (id) => /^\d+$/.test(String(id)) && Number(id) > 0;

const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};

const validateExpense = (body, partial = false) => {
  const errors = {};
  const required = ["tanggal", "category_id", "keterangan", "metode", "jumlah"];

  if (!partial) {
    for (const field of required) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        errors[field] = `${field} wajib diisi`;
      }
    }
  }

  if (body.metode === "transfer_bank" && !body.bank_id && !body.bank) {
    errors.bank_id = "bank_id wajib untuk transfer";
  }

  if (body.tanggal !== undefined && !isValidDate(body.tanggal)) {
    errors.tanggal = "Tanggal harus berformat YYYY-MM-DD";
  }

  if (body.category_id !== undefined) {
    const id = Number(body.category_id);

    if (body.category_id === "" || !Number.isSafeInteger(id) || id < 1) {
      errors.category_id = "Kategori tidak valid";
    }
  }

  if (body.keterangan !== undefined) {
    if (
      typeof body.keterangan !== "string" ||
      body.keterangan.trim().length < 3 ||
      body.keterangan.trim().length > 2000
    ) {
      errors.keterangan = "Keterangan harus 3-2000 karakter";
    }
  }

  if (body.metode !== undefined && !METHODS.includes(body.metode)) {
    errors.metode = "Metode harus cash, transfer_bank, atau qris";
  }

  if (body.jumlah !== undefined) {
    const amount = Number(body.jumlah);

    if (body.jumlah === "" || !Number.isSafeInteger(amount) || amount < 1) {
      errors.jumlah = "Jumlah harus bilangan bulat positif";
    }
  }

  if (partial && Object.keys(body).length === 0) {
    errors.body = "Minimal satu field harus dikirim";
  }

  // Tolak field asing supaya input tidak diam-diam diabaikan.
  const allowed = new Set([...required, "bank", "bank_id"]);
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) {
      errors[key] = "Field tidak dikenal";
    }
  }

  if (
    body.bank !== undefined &&
    body.bank !== null &&
    body.bank !== "" &&
    (typeof body.bank !== "string" ||
      body.bank.trim().length < 2 ||
      body.bank.trim().length > 50)
  ) {
    errors.bank = "Nama bank harus 2-50 karakter";
  }

  if (
    body.bank_id !== undefined &&
    body.bank_id !== null &&
    body.bank_id !== "" &&
    (!Number.isSafeInteger(Number(body.bank_id)) || Number(body.bank_id) < 1)
  ) {
    errors.bank_id = "bank_id tidak valid";
  }

  return errors;
};

const expenseIncludes = [
  {
    model: ExpenseCategory,
    as: "category",
    attributes: ["id", "nama", "deskripsi", "status"],
  },
  {
    model: Bank,
    as: "bank_ref",
    attributes: ["id", "nama", "no_rekening", "atas_nama", "status"],
    required: false,
  },
  {
    model: User,
    as: "creator",
    attributes: ["id", "name", "email"],
    required: false,
  },
];

const pickExpenseFields = async (body) => {
  const fields = {};

  for (const field of [
    "tanggal",
    "category_id",
    "keterangan",
    "metode",
    "jumlah",
    "bank",
    "bank_id",
  ]) {
    if (Object.hasOwn(body, field)) {
      fields[field] = field === "keterangan" ? body[field].trim() : body[field];
    }
  }

  if (fields.category_id !== undefined) {
    fields.category_id = Number(fields.category_id);
  }

  if (fields.bank_id !== undefined && fields.bank_id !== "" && fields.bank_id !== null) {
    fields.bank_id = Number(fields.bank_id);
  } else if (fields.bank_id === "") {
    fields.bank_id = null;
  }

  // Bersihkan bank_id bila bukan transfer_bank
  if (fields.metode && fields.metode !== "transfer_bank") {
    fields.bank = null;
    fields.bank_id = null;
  }

  // Kompatibilitas: sinkron nama bank teks dari bank_id bila bank kosong
  if (
    fields.bank_id &&
    (fields.bank === undefined || fields.bank === null || fields.bank === "")
  ) {
    const bankRow = await Bank.findByPk(fields.bank_id);
    if (bankRow) fields.bank = bankRow.nama;
  }

  if (fields.jumlah !== undefined) {
    fields.jumlah = String(fields.jumlah);
  }

  return fields;
};

const validateCategory = async (categoryId) => {
  const category = await ExpenseCategory.findByPk(categoryId);

  if (!category || category.status !== "active") {
    return null;
  }

  return category;
};

// GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const {
      search,
      category_id,
      from,
      to,
      metode,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        message: "page harus positif dan limit harus 1-100",
      });
    }

    const where = {};

    if (category_id !== undefined) {
      if (!validId(category_id)) {
        return res.status(400).json({
          message: "category_id tidak valid",
        });
      }

      where.category_id = Number(category_id);
    }

    if (metode !== undefined) {
      if (!METHODS.includes(metode)) {
        return res.status(400).json({
          message: "Metode tidak valid",
        });
      }

      where.metode = metode;
    }

    if (from !== undefined && !isValidDate(from)) {
      return res.status(400).json({
        message: "Format from harus YYYY-MM-DD",
      });
    }

    if (to !== undefined && !isValidDate(to)) {
      return res.status(400).json({
        message: "Format to harus YYYY-MM-DD",
      });
    }

    if (from && to && from > to) {
      return res.status(400).json({
        message: "from tidak boleh melebihi to",
      });
    }

    if (from || to) {
      where.tanggal = {};

      if (from) where.tanggal[Op.gte] = from;
      if (to) where.tanggal[Op.lte] = to;
    }

    if (search !== undefined) {
      if (typeof search !== "string" || search.length > 200) {
        return res.status(400).json({
          message: "Pencarian maksimal 200 karakter",
        });
      }

      where.keterangan = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    const { count, rows } = await Expense.findAndCountAll({
      where,
      include: expenseIncludes,
      order: [
        ["tanggal", "DESC"],
        ["id", "DESC"],
      ],
      limit: limitNumber,
      offset: (pageNumber - 1) * limitNumber,
      distinct: true,
    });

    const totalAmount = await Expense.sum("jumlah", { where });

    return res.status(200).json({
      message: "Data uang keluar berhasil diambil",
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: count,
        total_pages: Math.ceil(count / limitNumber),
      },
      total_pengeluaran: String(totalAmount ?? 0),
      data: rows,
    });
  } catch (error) {
    console.error("getExpenses:", error);
    return res.status(500).json({
      message: "Gagal mengambil data uang keluar",
    });
  }
};

// GET /api/expenses/:id
export const getExpenseById = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const expense = await Expense.findByPk(req.params.id, {
      include: expenseIncludes,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Data uang keluar tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Detail uang keluar berhasil diambil",
      data: expense,
    });
  } catch (error) {
    console.error("getExpenseById:", error);
    return res.status(500).json({
      message: "Gagal mengambil detail uang keluar",
    });
  }
};

// POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const errors = validateExpense(req.body);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors,
      });
    }

    const category = await validateCategory(Number(req.body.category_id));

    if (!category) {
      return res.status(400).json({
        message: "Kategori tidak ditemukan atau tidak aktif",
      });
    }

    const fields = await pickExpenseFields(req.body);

    const expense = await Expense.create({
      ...fields,
      created_by: req.user.id,
    });

    const result = await Expense.findByPk(expense.id, {
      include: expenseIncludes,
    });

    return res.status(201).json({
      message: "Uang keluar berhasil ditambahkan",
      data: result,
    });
  } catch (error) {
    console.error("createExpense:", error);
    return res.status(500).json({
      message: "Gagal menambahkan uang keluar",
    });
  }
};

// PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const errors = validateExpense(req.body, true);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors,
      });
    }

    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Data uang keluar tidak ditemukan",
      });
    }

    if (req.body.category_id !== undefined) {
      const category = await validateCategory(Number(req.body.category_id));

      if (!category) {
        return res.status(400).json({
          message: "Kategori tidak ditemukan atau tidak aktif",
        });
      }
    }

    const fields = await pickExpenseFields(req.body);
    await expense.update(fields);

    const result = await Expense.findByPk(expense.id, {
      include: expenseIncludes,
    });

    return res.status(200).json({
      message: "Uang keluar berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    console.error("updateExpense:", error);
    return res.status(500).json({
      message: "Gagal memperbarui uang keluar",
    });
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Data uang keluar tidak ditemukan",
      });
    }

    await expense.destroy();

    return res.status(200).json({
      message: "Uang keluar berhasil dihapus",
    });
  } catch (error) {
    console.error("deleteExpense:", error);
    return res.status(500).json({
      message: "Gagal menghapus uang keluar",
    });
  }
};
