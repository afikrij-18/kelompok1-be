import bcrypt from "bcrypt";
import User from "../models/User.js";

// ========================================
// GET ALL USERS
// ========================================
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "status",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });

    return res.status(200).json({
      message: "Data user berhasil diambil",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// GET USER BY ID
// ========================================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "status",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Data user berhasil diambil",
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// CREATE USER
// ========================================
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, status, role } = req.body;

    // Validasi input wajib
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    // Cek email sudah digunakan atau belum
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email sudah digunakan",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      status,
      role,
    });

    return res.status(201).json({
      message: "User berhasil dibuat",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    console.error("Stack:", error.stack);

    // Error validasi Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data yang diberikan tidak valid",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Error unique constraint
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email sudah digunakan",
      });
    }

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// UPDATE USER
// ========================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, role } = req.body;

    // Password tidak boleh diubah melalui endpoint ini
    if ("password" in req.body) {
      return res.status(400).json({
        message:
          "Password tidak dapat diubah melalui endpoint ini. Gunakan endpoint perubahan password.",
      });
    }

    // Pastikan ada data yang ingin diubah
    if (
      name === undefined &&
      email === undefined &&
      phone === undefined &&
      status === undefined &&
      role === undefined
    ) {
      return res.status(400).json({
        message: "Tidak ada data yang diubah",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Cek email jika ingin diubah
    if (email !== undefined && email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email sudah digunakan",
        });
      }

      user.email = email;
    }

    // Update nama
    if (name !== undefined) {
      user.name = name;
    }

    // Update nomor telepon
    if (phone !== undefined) {
      user.phone = phone;
    }

    // Update status
    if (status !== undefined) {
      user.status = status;
    }

    // Update role
    if (role !== undefined) {
      user.role = role;
    }

    await user.save();

    return res.status(200).json({
      message: "User berhasil diperbarui",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    console.error("Stack:", error.stack);

    // Error validasi Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data yang diberikan tidak valid",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Error unique constraint
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Email sudah digunakan",
      });
    }

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// DELETE USER
// ========================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// UPDATE USER PASSWORD
// ========================================
const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Validasi password baru
    if (!newPassword) {
      return res.status(400).json({
        message: "Password baru wajib diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    // Cari user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password user berhasil diubah",
    });
  } catch (error) {
    console.error("Update user password error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
};
