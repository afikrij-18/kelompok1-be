import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ========================================
// LOGIN Admin dan Owner
// ========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // Jangan memberitahu apakah email terdaftar atau tidak
    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // Cek password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // Cek status akun
    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Akun tidak aktif",
      });
    }

    // ========================================
    // Hanya Admin dan Owner yang dapat login
    // ========================================
    if (!["admin", "owner"].includes(user.role)) {
      return res.status(403).json({
        message: "Akses login tidak diizinkan",
      });
    }

    // Membuat JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "kelompok1_secret_key",
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// GET PROFILE
// ========================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
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
      message: "Profil berhasil diambil",
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// UPDATE PROFILE
// ========================================
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res.status(400).json({
        message: "Tidak ada data yang diubah",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Cek email jika ingin diubah
    if (email && email !== user.email) {
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
    if (name) {
      user.name = name;
    }

    // Update nomor telepon
    if (phone) {
      user.phone = phone;
    }

    await user.save();

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
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

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// UPDATE PASSWORD
// ========================================
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru wajib diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru minimal 6 karakter",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Cek password lama
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Password lama salah",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error("Update password error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// ========================================
// LOGOUT
// ========================================
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Logout error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

export {
  login,
  getProfile,
  updateProfile,
  updatePassword,
  logout,
};