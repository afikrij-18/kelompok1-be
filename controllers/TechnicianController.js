import Technician from "../models/Technician.js";

// GET semua teknisi
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Data teknisi berhasil diambil",
      data: technicians,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data teknisi",
      error: error.message,
    });
  }
};

// GET teknisi berdasarkan ID
export const getTechnicianById = async (req, res) => {
  try {
    const { id } = req.params;
    const technician = await Technician.findByPk(id);

    if (!technician) {
      return res.status(404).json({ message: "Teknisi tidak ditemukan" });
    }

    res.status(200).json({
      message: "Data teknisi berhasil diambil",
      data: technician,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data teknisi",
      error: error.message,
    });
  }
};

// CREATE teknisi
export const createTechnician = async (req, res) => {
  try {
    const { name, phone, status } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message: "Nama dan nomor telepon wajib diisi",
      });
    }

    const technician = await Technician.create({
      name,
      phone,
      status: status || "active",
    });

    res.status(201).json({
      message: "Teknisi berhasil dibuat",
      data: technician,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data yang diberikan tidak valid",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    res.status(500).json({
      message: "Gagal membuat teknisi",
      error: error.message,
    });
  }
};

// UPDATE teknisi
export const updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, status } = req.body;

    const technician = await Technician.findByPk(id);

    if (!technician) {
      return res.status(404).json({ message: "Teknisi tidak ditemukan" });
    }

    await technician.update({
      name: name ?? technician.name,
      phone: phone ?? technician.phone,
      status: status ?? technician.status,
    });

    res.status(200).json({
      message: "Teknisi berhasil diperbarui",
      data: technician,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data yang diberikan tidak valid",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    res.status(500).json({
      message: "Gagal memperbarui teknisi",
      error: error.message,
    });
  }
};

// DELETE teknisi
export const deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const technician = await Technician.findByPk(id);

    if (!technician) {
      return res.status(404).json({ message: "Teknisi tidak ditemukan" });
    }

    await technician.destroy();

    res.status(200).json({ message: "Teknisi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus teknisi",
      error: error.message,
    });
  }
};
