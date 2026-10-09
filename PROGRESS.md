# Progres Project Backend (kelompok1-be)

Dokumen ini berisi rincian teknis dari progres pengembangan backend pada sistem informasi manajemen servis (kelompok1-be). Sistem ini dirancang untuk menangani operasional layanan servis (terutama servis AC/elektronik) dengan fitur manajemen data, karyawan, teknisi, pemesanan, penugasan teknisi, pembayaran, dan laporan keuangan.

## 1. Tech Stack (Teknologi yang Digunakan Saat Ini)
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Bahasa Pemrograman:** JavaScript (ES Modules / `type: "module"`), ESlint
- **Database:** MySQL
- **ORM (Object Relational Mapping):** Sequelize
- **Autentikasi & Keamanan:** JSON Web Token (JWT) & bcrypt

## 2. Arsitektur & Struktur Direktori
Sistem ini mengadopsi arsitektur **MVC (Model-View-Controller)** pada lapisan backend (tanpa View). Struktur direktorinya adalah sebagai berikut:

- `config/` : Berisi pengaturan dan konfigurasi sistem (`database.js` untuk koneksi ke MySQL).
- `models/` : Berisi representasi tabel database ke dalam bentuk objek (Sequelize Models) beserta definisi relasinya (`User.js`, `Technician.js`, `Product.js`, `Category.js`, `Service.js`, `Customer.js`, `CustomerAddress.js`, `BookingService.js`, `BookingUnit.js`, `Transaction.js`, `index.js`).
- `controllers/` : Berisi *business logic* utama (`authController.js`, `UserController.js`, `TechnicianController.js`, `ProductController.js`, `CategoryController.js`, `ServiceController.js`, `bookingController.js`, `TransactionController.js`).
- `routes/` : Berisi definisi *endpoint* API (`authRoutes.js`, `UserRoutes.js`, `technicianRoutes.js`, `ProductRoutes.js`, `categoryRoutes.js`, `serviceRoutes.js`, `bookingRoutes.js`, `transactionRoutes.js`).
- `middlewares/` : Berisi fungsi perantara seperti `authMiddleware` (validasi JWT) dan `roleMiddleware` (pembatasan hak akses `admin`, `owner`).
- `database/` : Berisi file *dump* SQL (`kelompok1_db.sql`).

## 3. Detail Skema Database & Relasi
Sistem ini menggunakan relasi database yang terstruktur dengan pemisahan entitas administratif, operasional, dan finansial:

1. **`users`** (Tabel Akun Sistem / Staf Administratif)
   - Kolom: `id`, `name`, `email`, `password`, `phone`, `status` (ENUM: active, inactive), `role` (ENUM: admin, owner), `createdAt`, `updatedAt`
   - Catatan: Khusus untuk hak akses *login*. Role `technician` sudah dihapus dari tabel ini.
2. **`technicians`** (Tabel Data Teknisi Operasional)
   - Kolom: `id`, `name`, `phone`, `status` (active/inactive), `createdAt`, `updatedAt`
   - Catatan: Terpisah dari `users`. Tanpa kolom `specialization`. Dikelola penuh (CRUD) oleh Admin/Owner.
3. **`products`** (Tabel Suku Cadang / Barang)
   - Kolom: `id`, `name`, `description`, `price`, `stock`, `createdAt`, `updatedAt`
4. **`categories`** (Tabel Kategori Layanan - Flat)
   - Kolom: `id`, `name`, `createdAt`, `updatedAt`
   - Catatan: Kolom `parent_id` dihapus karena tidak terpakai. Tidak ada relasi *self-referencing*. Response API berupa flat list, bukan tree.
5. **`services`** (Tabel Layanan/Jasa Servis)
   - Kolom: `id`, `name`, `description`, `price`, `category_id`, `createdAt`, `updatedAt`
   - Relasi: *Belongs-To* ke tabel `categories`.
6. **`customers`** (Tabel Pelanggan)
   - Kolom: `id`, `name`, `phone`, `createdAt`, `updatedAt`
7. **`customer_addresses`** (Tabel Alamat Pelanggan)
   - Kolom: `id`, `customer_id`, `label`, `address`, `notes_location`, `createdAt`, `updatedAt`
   - Relasi: *Belongs-To* ke tabel `customers` (1 Customer memiliki banyak alamat).
8. **`booking_services`** (Tabel Induk Pemesanan)
   - Kolom: `id`, `reg_no` (unik, contoh `BK-20261008-3176`), `status` (pending, confirmed, completed, cancelled), `customer_id`, `address_id`, `technician_id` (FK ke `technicians`), `created_by` (FK ke `users`), `booking_date`, `booking_time`, `total_price`, `notes`, `createdAt`, `updatedAt`
   - Relasi: Terhubung ke `customers`, `customer_addresses`, `technicians`, dan `users`.
   - Catatan: `total_price` wajib dihitung otomatis di backend (`SUM` harga service per unit), bukan input manual dari client.
9. **`booking_units`** (Tabel Detail Unit yang Diservis)
   - Kolom: `id`, `booking_id`, `service_id`, `brand_ac`, `type_ac`, `pk`, `lokasi`, `keluhan`, `price`, `createdAt`, `updatedAt`
   - Relasi: *Belongs-To* ke `booking_services` (1 pesanan = banyak unit) dan merujuk ke `services`.
10. **`transactions`** (Tabel Pembayaran / Dasar Laporan Keuangan)
    - Kolom: `id`, `booking_id` (FK ke `booking_services`), `invoice_no` (unik, contoh `INV-202610-001`), `payment_method` (ENUM: cash, transfer_bank, qris), `amount_paid`, `payment_status` (ENUM: pending, paid, failed), `payment_date`, `notes`, `created_by` (FK ke `users`), `createdAt`, `updatedAt`
    - Catatan: Tidak memakai field `transaction_no` dan `proof_image`. Nomor referensi memakai `invoice_no`, catatan tambahan memakai `notes`.
    - Relasi: *Belongs-To* ke `booking_services` dan ke `users` (pencatat pembayaran).

## 4. Alur Proses (Workflow) Terkini
Alur kerja end-to-end: `Master Data -> Booking (Auto Confirmed + Teknisi + Payment Langsung) -> Transaction (invoice_no + notes) -> Laporan Keuangan`.

**A. Alur Admin & Owner**
- **Autentikasi:** *Login* (POST `/api/auth/login`) memakai tabel `users` untuk mendapatkan JWT. Hanya `admin` dan `owner`.
- **Kelola Data Master (CRUD, protected `authMiddleware + roleMiddleware`):**
  - Master Staf (`/api/users`).
  - Master Teknisi (`/api/technicians`).
  - Master Suku Cadang (`/api/products`).
  - Master Layanan (`/api/categories` flat dan `/api/services`).
- **Proses Pemesanan / Booking (`POST /api/bookings`):**
  - Input dari Admin/Owner otomatis berstatus `confirmed` (bukan `pending`).
  - Pencatatan audit trail: `created_by` diisi otomatis dari ID Admin/Owner yang sedang login.
  - Penugasan Teknisi (`technician_id`): Sistem memvalidasi ketersediaan teknisi dan menolak jika terjadi bentrok jadwal pada tanggal & waktu yang sama (toleransi durasi pengerjaan).
  - Pembayaran Langsung (`payment` object opsional): Admin/Owner dapat langsung memilih `payment_method`, `amount_paid`, dan `payment_status` saat membuat booking, sehingga entitas `Transaction` langsung tercatat secara otomatis.
- **Proses Pembayaran / Transaksi Terpisah (`/api/transactions`):**
  - Pembuatan transaksi per booking dengan `generateInvoiceNo()`.
  - Validasi nominal dan pencatatan kasir.
- **Laporan Keuangan (`GET /api/transactions/report?from=&to=`):**
  - Rekap omzet harian/bulanan, rekap per `payment_method`, dan piutang.

**B. Alur Akses Publik / Tamu (Guest)**
- Semua jalur API saat ini terproteksi JWT Admin/Owner. Guest belum memiliki alur *self-service booking*.
