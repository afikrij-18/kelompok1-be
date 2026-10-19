import db from "../config/database.js";
import { Product } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[products] DB connected...");

    const count = await Product.count();
    if (count > 0) {
      console.log(`[products] skipped, already ${count} rows`);
      process.exit(0);
    }

    const products = [
      { name: "Produk Sparepart 1", description: "Deskripsi komponen kualitas tinggi 1", price: 55000, stock: 12 },
      { name: "Produk Sparepart 2", description: "Deskripsi komponen kualitas tinggi 2", price: 60000, stock: 14 },
      { name: "Produk Sparepart 3", description: "Deskripsi komponen kualitas tinggi 3", price: 65000, stock: 16 },
      { name: "Produk Sparepart 4", description: "Deskripsi komponen kualitas tinggi 4", price: 70000, stock: 18 },
      { name: "Produk Sparepart 5", description: "Deskripsi komponen kualitas tinggi 5", price: 75000, stock: 20 },
      { name: "Produk Sparepart 6", description: "Deskripsi komponen kualitas tinggi 6", price: 80000, stock: 22 },
      { name: "Produk Sparepart 7", description: "Deskripsi komponen kualitas tinggi 7", price: 85000, stock: 24 },
      { name: "Produk Sparepart 8", description: "Deskripsi komponen kualitas tinggi 8", price: 90000, stock: 26 },
      { name: "Produk Sparepart 9", description: "Deskripsi komponen kualitas tinggi 9", price: 95000, stock: 28 },
      { name: "Produk Sparepart 10", description: "Deskripsi komponen kualitas tinggi 10", price: 100000, stock: 30 },
      { name: "Produk Sparepart 11", description: "Deskripsi komponen kualitas tinggi 11", price: 105000, stock: 32 },
      { name: "Produk Sparepart 12", description: "Deskripsi komponen kualitas tinggi 12", price: 110000, stock: 34 },
      { name: "Produk Sparepart 13", description: "Deskripsi komponen kualitas tinggi 13", price: 115000, stock: 36 },
      { name: "Produk Sparepart 14", description: "Deskripsi komponen kualitas tinggi 14", price: 120000, stock: 38 },
      { name: "Produk Sparepart 15", description: "Deskripsi komponen kualitas tinggi 15", price: 125000, stock: 40 },
    ];

    await Product.bulkCreate(products);

    console.log("[products] seeded 15 rows");
    process.exit(0);
  } catch (err) {
    console.error("[products] failed:", err.message);
    process.exit(1);
  }
};

run();
