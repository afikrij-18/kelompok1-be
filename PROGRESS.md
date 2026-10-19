# Progres Project Backend (`kelompok1-be`)

Dokumen ini berisi rincian teknis dari progres pengembangan backend pada sistem informasi manajemen servis (`kelompok1-be`). Sistem ini dirancang untuk menangani operasional layanan servis (terutama servis AC/elektronik) dengan fitur manajemen data, karyawan, teknisi, pemesanan, penugasan teknisi, pembayaran, pengeluaran, garansi, dan laporan keuangan.

## 1. Tech Stack (Teknologi yang Digunakan Saat Ini)
- **Runtime Environment:** Node.js (ESM / `type: "module"`)
- **Framework:** Express.js
- **Database:** SQLite (`database/database.sqlite`, ter-ignore oleh `.gitignore`)
- **ORM:** Sequelize
- **Autentikasi & Keamanan:** JSON Web Token (JWT) & bcrypt (cost 12)

## 2. Arsitektur & Struktur Direktori
- `config/` : Pengaturan koneksi (`database.js` SQLite) dan konfigurasi auth (`auth.js`).
- `models/` : Representasi 14 tabel Sequelize (`User`, `Technician`, `Product`, `Category`, `Service`, `Customer`, `CustomerAddress`, `BookingService`, `BookingUnit`, `Transaction`, `Expense`, `ExpenseCategory`, `Bank`, `WarrantyClaim`) dan relasinya di `index.js`.
- `controllers/` : Business logic utama untuk tiap entitas.
- `routes/` : 13 definisi endpoint API.
- `middlewares/` : `authMiddleware` (validasi JWT) dan `roleMiddleware` (pembatasan hak akses `admin`, `owner`).
- `seeds/` : Seeder data master, user, teknisi, bank, customer, booking, transaksi, expense-category, expense, dan warranties.
- `database/` : File dump SQL lama (`kelompok1_db.sql`, arsip MySQL) dan SQLite live (`database.sqlite`).

## 3. Detail Skema Database & Relasi (14 Tabel)
1. **`users`** : Akun staf/admin/owner (`id`, `name`, `email`, `password`, `phone`, `status`, `role`). Role `technician` ditiadakan.
2. **`technicians`** : Data teknisi operasional terpisah dari users (`id`, `name`, `phone`, `status`).
3. **`products`** : Suku cadang / barang (`id`, `name`, `description`, `price`, `stock`).
4. **`categories`** : Kategori layanan flat (`id`, `name`).
5. **`services`** : Layanan/jasa servis (`id`, `name`, `description`, `price`, `category_id`, `warranty_days`).
6. **`customers`** : Data pelanggan (`id`, `name`, `phone` - unique).
7. **`customer_addresses`** : Alamat pelanggan (`id`, `customer_id`, `label`, `address`, `notes_location`). 1 customer banyak alamat.
8. **`booking_services`** : Induk pesanan (`id`, `reg_no`, `status` [pending, confirmed, completed, cancelled], `customer_id`, `address_id`, `technician_id`, `created_by`, `booking_date`, `booking_time`, `total_price`, `notes`).
9. **`booking_units`** : Detail unit AC yang diservis (`id`, `booking_id`, `service_id`, `brand_ac`, `type_ac`, `pk`, `lokasi`, `keluhan`, `price`, `warranty_expiry_date`).
10. **`transactions`** : Pembayaran / kasir (`id`, `booking_id`, `invoice_no`, `payment_method` [cash, transfer_bank, qris], `bank_id`, `amount_paid`, `payment_status` [pending, paid, failed], `payment_date`, `notes`, `created_by`).
11. **`expense_categories`** : Kategori uang keluar (`id`, `nama`, `deskripsi`, `status`, `RESTRICT` delete jika ada relasi).
12. **`expenses`** : Pencatatan uang keluar (`id`, `tanggal`, `category_id`, `keterangan`, `metode`, `bank`, `bank_id`, `jumlah`, `created_by`).
13. **`banks`** : Master bank / rekening pembayaran (`id`, `nama`, `no_rekening`, `atas_nama`, `status`).
14. **`warranty_claims`** : Pengajuan klaim garansi servis (`id`, `booking_unit_id`, `claim_date`, `keluhan`, `status` [pending, approved, rejected, in_progress, completed], `created_by`, `handled_by`, `resolution_notes`).

## 4. Alur Proses (Workflow) Terkini

### A. Alur Admin & Owner (Protected JWT + Role)
- **Auth:** `POST /api/auth/login` (tabel `users`, role `admin` / `owner`).
- **Master Data CRUD:** Users, Technicians, Products, Categories, Services, Expense Categories, Banks.
- **Booking & Pembayaran Langsung (`POST /api/bookings`):**
  - Status otomatis `confirmed` (bukan pending).
  - `created_by` terisi otomatis dari user login.
  - Validasi bentrok jadwal teknisi (toleransi 2 jam pada tanggal yang sama).
  - Inline `payment` object langsung mencatat entitas `Transaction`.
- **Transaksi & Keuangan (`/api/transactions`, `/api/expenses`):**
  - Rekap omzet, filter metode pembayaran, dan pencatatan kas keluar operasional.
  - **Fitur Garansi Otomatis:** Saat booking diubah ke status `completed` dan akumulasi pembayaran lunas (`>= total_price`), sistem otomatis menerbitkan `warranty_expiry_date` per unit berdasarkan `services.warranty_days`.
- **Klaim Garansi (`/api/warranties/claims`):** Cek keaktifan garansi (`/api/warranties/check`), pengajuan klaim, dan update status penanganan.

### B. Alur Publik / Tamu (Guest - Tanpa Auth)
- **`GET /api/public/services`** : Katalog layanan untuk halaman depan.
- **`POST /api/public/bookings`** : Pelanggan pesan servis tanpa login (status otomatis `pending`, `created_by: null`, tanpa teknisi awal).
- **`GET /api/public/bookings/status?reg_no=`** : Pelanggan melacak status pesanan menggunakan nomor registrasi (`BK-YYYYMMDD-XXXX`).
