const roleMiddleware = (req, res, next) => {
  try {
    // Pastikan user sudah terautentikasi
    // dan data user tersedia dari authMiddleware
    if (!req.user) {
      console.error("roleMiddleware: req.user tidak ditemukan.");

      return res.status(401).json({
        message: "Akses ditolak. Silakan login terlebih dahulu.",
      });
    }

    // Role yang diperbolehkan mengelola user
    const allowedRoles = ["admin", "owner"];

    // Cek apakah role user memiliki izin
    if (!allowedRoles.includes(req.user.role)) {
      console.warn(
        `roleMiddleware: Akses ditolak untuk user ID ${req.user.id} dengan role ${req.user.role}.`,
      );

      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk mengakses fitur ini.",
      });
    }

    // User memiliki izin
    next();
  } catch (error) {
    // Detail error hanya ditampilkan di server
    console.error("roleMiddleware error:", error);

    // Client hanya mendapatkan pesan umum
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

export default roleMiddleware;
