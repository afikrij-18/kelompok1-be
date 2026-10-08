import express from "express";
import cors from "cors";
import db from "./config/database.js";

// Import all models and associations
import "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", bookingRoutes);

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
