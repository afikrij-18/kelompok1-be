import express from "express";
import cors from "cors";
import db from "./config/database.js";

import "./models/User.js";
import "./models/Product.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

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

    await db.sync();
    // await db.sync({ alter: true });

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
