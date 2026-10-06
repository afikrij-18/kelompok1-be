import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    // Jangan memberitahu apakah email ada atau tidak
    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
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
        },
      },
    });
  } catch (error) {
    // Detail untuk developer/server
    console.error("Login error:", error);
    console.error("Stack:", error.stack);

    // Pesan aman untuk user
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "createdAt", "updatedAt"],
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
    console.error("❌ Get profile error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
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

    // Kalau email ingin diubah, cek apakah sudah digunakan user lain
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

    if (name) {
      user.name = name;
    }

    await user.save();

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

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
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

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
    console.error("❌ Update password error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

export { login, getProfile, updateProfile, updatePassword, logout };
