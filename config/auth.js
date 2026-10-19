import "dotenv/config";

// Konfigurasi JWT terpusat agar middleware dan controller memakai nilai yang sama.
// Fallback dipakai supaya project tetap jalan tanpa file .env (mode development).
export const JWT_SECRET = process.env.JWT_SECRET || "kelompok1_secret_key";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
