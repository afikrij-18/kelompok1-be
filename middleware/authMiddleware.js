import jwt from "jsonwebtoken";

const JWT_SECRET = "development-secret-key";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek apakah Authorization header ada
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
      });
    }

    // Format yang diharapkan:
    // Authorization: Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Simpan data dari token ke request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;