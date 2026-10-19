import "dotenv/config";
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
import expenseRoutes from "./routes/expenseRoutes.js";
import expenseCategoryRoutes from "./routes/expenseCategoryRoutes.js";
import bankRoutes from "./routes/bankRoutes.js";
import warrantyRoutes from "./routes/warrantyRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

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
app.use("/api/expenses", expenseRoutes);
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/warranties", warrantyRoutes);
app.use("/api/public", publicRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend API berjalan",
  });
});

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Database berhasil terhubung");

    // Sinkronisasi database.
    // default : membuat tabel yang belum ada (tidak mengubah tabel yang sudah ada)
    // DB_SYNC_ALTER=true : db.sync({ alter: true }) -> pada SQLite tabel di-recreate,
    //                       sehingga data pada tabel yang berubah akan hilang.
    const shouldAlter = process.env.DB_SYNC_ALTER === "true";

    await db.sync(shouldAlter ? { alter: true } : {});
    console.log(
      shouldAlter
        ? "Table berhasil disinkronisasi (alter mode)"
        : "Table berhasil dibuat/disinkronisasi",
    );

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
