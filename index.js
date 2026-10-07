import express from "express";
import cors from "cors";
import db from "./config/database.js";

// Import models (pastikan model mendefinisikan relasinya masing-masing)
import "./models/User.js";
import "./models/Product.js";
import Category from "./models/Category.js";
import Service from "./models/Service.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend API berjalan",
  });
});

const PORT = 5000;

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Database berhasil terhubung");

    // Sinkronisasi database
    // Catatan: Gunakan { alter: true } jika ingin otomatis memperbarui struktur tabel di DB
    // saat ada perubahan model, tapi hati-hati di lingkungan production.
    await db.sync();
    console.log("Table berhasil dibuat/disinkronisasi");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database gagal terhubung");
    console.error("Detail:", error.message);
    console.error("Stack:", error.stack);

    process.exit(1);
  }
};

startServer();
