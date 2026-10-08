import { Transaction, BookingService, User } from "../models/index.js";
import { Op } from "sequelize";

// Helper untuk generate nomor invoice unik (contoh: INV-202610-3819)
const generateInvoiceNo = () => {
  const date = new Date().toISOString().slice(0, 7).replace("-", "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date}-${random}`;
};

// GET semua transaksi
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: BookingService,
          as: "booking",
          attributes: ["id", "reg_no", "total_price", "status"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Data transaksi berhasil diambil",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
};

// GET transaksi berdasarkan ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: BookingService,
          as: "booking",
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data transaksi berhasil diambil",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data transaksi",
      error: error.message,
    });
  }
};

// CREATE transaksi (Pembayaran)
export const createTransaction = async (req, res) => {
  try {
    const { booking_id, payment_method, amount_paid, payment_status, notes } = req.body;

    if (!booking_id || !payment_method || amount_paid === undefined) {
      return res.status(400).json({
        message: "booking_id, payment_method, dan amount_paid wajib diisi",
      });
    }

    // Cek keberadaan booking
    const booking = await BookingService.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Data booking tidak ditemukan" });
    }

    const invoice_no = generateInvoiceNo();

    const transaction = await Transaction.create({
      booking_id,
      invoice_no,
      payment_method,
      amount_paid: Number(amount_paid),
      payment_status: payment_status || "paid",
      payment_date: new Date(),
      notes: notes || null,
      created_by: req.user ? req.user.id : null,
    });

    // Jika pembayaran lunas, update status booking menjadi completed/confirmed
    if (transaction.payment_status === "paid" && amount_paid >= booking.total_price) {
      await booking.update({ status: "completed" });
    }

    res.status(201).json({
      message: "Transaksi berhasil dicatat",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mencatat transaksi",
      error: error.message,
    });
  }
};

// UPDATE transaksi
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, amount_paid, payment_status, notes } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    await transaction.update({
      payment_method: payment_method ?? transaction.payment_method,
      amount_paid: amount_paid !== undefined ? Number(amount_paid) : transaction.amount_paid,
      payment_status: payment_status ?? transaction.payment_status,
      notes: notes ?? transaction.notes,
    });

    res.status(200).json({
      message: "Transaksi berhasil diperbarui",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui transaksi",
      error: error.message,
    });
  }
};

// DELETE transaksi
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    await transaction.destroy();

    res.status(200).json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus transaksi",
      error: error.message,
    });
  }
};

// REPORT - Laporan Keuangan
export const getFinancialReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const whereClause = {
      payment_status: "paid",
    };

    if (from && to) {
      whereClause.payment_date = {
        [Op.between]: [new Date(from), new Date(to + " 23:59:59")],
      };
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [
        {
          model: BookingService,
          as: "booking",
          attributes: ["id", "reg_no", "total_price"],
        },
      ],
      order: [["payment_date", "DESC"]],
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount_paid, 0);

    // Rekap per metode pembayaran
    const summaryByMethod = transactions.reduce((acc, curr) => {
      acc[curr.payment_method] = (acc[curr.payment_method] || 0) + curr.amount_paid;
      return acc;
    }, {});

    res.status(200).json({
      message: "Laporan keuangan berhasil diambil",
      period: { from: from || "All-time", to: to || "All-time" },
      total_transactions: transactions.length,
      total_revenue: totalRevenue,
      summary_by_method: summaryByMethod,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan keuangan",
      error: error.message,
    });
  }
};
