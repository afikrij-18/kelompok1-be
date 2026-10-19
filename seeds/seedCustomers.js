import db from "../config/database.js";
import { Customer, CustomerAddress } from "../models/index.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("[customers] DB connected...");

    const count = await Customer.count();
    if (count > 0) {
      console.log(`[customers] skipped, already ${count} rows`);
      process.exit(0);
    }

    const customers = [
      { name: "Pelanggan 1", phone: "081234567901" },
      { name: "Pelanggan 2", phone: "081234567902" },
      { name: "Pelanggan 3", phone: "081234567903" },
      { name: "Pelanggan 4", phone: "081234567904" },
      { name: "Pelanggan 5", phone: "081234567905" },
      { name: "Pelanggan 6", phone: "081234567906" },
      { name: "Pelanggan 7", phone: "081234567907" },
      { name: "Pelanggan 8", phone: "081234567908" },
      { name: "Pelanggan 9", phone: "081234567909" },
      { name: "Pelanggan 10", phone: "081234567910" },
      { name: "Pelanggan 11", phone: "081234567911" },
      { name: "Pelanggan 12", phone: "081234567912" },
      { name: "Pelanggan 13", phone: "081234567913" },
      { name: "Pelanggan 14", phone: "081234567914" },
      { name: "Pelanggan 15", phone: "081234567915" },
      { name: "Customer Test", phone: "08999999999" },
      { name: "Rizky Pratama", phone: "081122334455" },
      { name: "Dewi Lestari", phone: "085288990011" },
      { name: "Hendra Wijaya", phone: "081377665544" },
      { name: "Maya Indah", phone: "082299887766" },
      { name: "Heri", phone: "08123123123" },
      { name: "Felix", phone: "0876544321" },
    ];

    const createdCustomers = await Customer.bulkCreate(customers);

    const addresses = [
      { customer_id: createdCustomers[0].id, label: "Rumah", address: "Jl. Contoh No. 1, Kota Jakarta", notes_location: "Patokan dekat gedung 1" },
      { customer_id: createdCustomers[1].id, label: "Kantor", address: "Jl. Contoh No. 2, Kota Jakarta", notes_location: "Patokan dekat gedung 2" },
      { customer_id: createdCustomers[2].id, label: "Rumah", address: "Jl. Contoh No. 3, Kota Jakarta", notes_location: "Patokan dekat gedung 3" },
      { customer_id: createdCustomers[3].id, label: "Kantor", address: "Jl. Contoh No. 4, Kota Jakarta", notes_location: "Patokan dekat gedung 4" },
      { customer_id: createdCustomers[4].id, label: "Rumah", address: "Jl. Contoh No. 5, Kota Jakarta", notes_location: "Patokan dekat gedung 5" },
      { customer_id: createdCustomers[5].id, label: "Kantor", address: "Jl. Contoh No. 6, Kota Jakarta", notes_location: "Patokan dekat gedung 6" },
      { customer_id: createdCustomers[6].id, label: "Rumah", address: "Jl. Contoh No. 7, Kota Jakarta", notes_location: "Patokan dekat gedung 7" },
      { customer_id: createdCustomers[7].id, label: "Kantor", address: "Jl. Contoh No. 8, Kota Jakarta", notes_location: "Patokan dekat gedung 8" },
      { customer_id: createdCustomers[8].id, label: "Rumah", address: "Jl. Contoh No. 9, Kota Jakarta", notes_location: "Patokan dekat gedung 9" },
      { customer_id: createdCustomers[9].id, label: "Kantor", address: "Jl. Contoh No. 10, Kota Jakarta", notes_location: "Patokan dekat gedung 10" },
      { customer_id: createdCustomers[10].id, label: "Rumah", address: "Jl. Contoh No. 11, Kota Jakarta", notes_location: "Patokan dekat gedung 11" },
      { customer_id: createdCustomers[11].id, label: "Kantor", address: "Jl. Contoh No. 12, Kota Jakarta", notes_location: "Patokan dekat gedung 12" },
      { customer_id: createdCustomers[12].id, label: "Rumah", address: "Jl. Contoh No. 13, Kota Jakarta", notes_location: "Patokan dekat gedung 13" },
      { customer_id: createdCustomers[13].id, label: "Kantor", address: "Jl. Contoh No. 14, Kota Jakarta", notes_location: "Patokan dekat gedung 14" },
      { customer_id: createdCustomers[14].id, label: "Rumah", address: "Jl. Contoh No. 15, Kota Jakarta", notes_location: "Patokan dekat gedung 15" },
      { customer_id: createdCustomers[15].id, label: "Rumah Utama", address: "Jl. Testing No. 1, Padang", notes_location: "Cat rumah warna oranye dekat tiang listrik" },
      { customer_id: createdCustomers[16].id, label: "Rumah Utama", address: "Jl. M. Hatta No. 12, Padang", notes_location: "Cat pagar hitam, dekat warung kelontong" },
      { customer_id: createdCustomers[16].id, label: "Kantor Cabang", address: "Jl. Sudirman No. 88, Padang", notes_location: "Lantai 2 ruang manajer" },
      { customer_id: createdCustomers[17].id, label: "Kontrakan", address: "Jl. Khatib Sulaiman Blok C No. 5, Padang", notes_location: "Masuk lewat gerbang samping" },
      { customer_id: createdCustomers[18].id, label: "Rumah Orang Tua", address: "Jl. Veteran No. 101, Padang", notes_location: "Rumah cat putih berlantai dua" },
      { customer_id: createdCustomers[19].id, label: "Toko Butik", address: "Jl. Permindo No. 14, Pasar Raya, Padang", notes_location: "Deretan toko baju lantai dasar" },
      { customer_id: createdCustomers[20].id, label: "rumah putih", address: "Jl. jalan jalan. no 1, rt 1, rw  1, gang pertama", notes_location: null },
      { customer_id: createdCustomers[21].id, label: "Alamat Utama", address: "Jalan anggrek, no 20, gang kelinci", notes_location: null },
    ];

    await CustomerAddress.bulkCreate(addresses);

    console.log("[customers] seeded 22 customers + 23 addresses");
    process.exit(0);
  } catch (err) {
    console.error("[customers] failed:", err.message);
    process.exit(1);
  }
};

run();
