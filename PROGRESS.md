# Progres Project Backend (kelompok1-be)

Dokumen ini berisi rincian teknis dari progres pengembangan backend pada sistem informasi manajemen servis (kelompok1-be). Sistem ini dirancang untuk menangani operasional layanan servis (terutama servis AC/elektronik) dengan fitur manajemen data, karyawan, dan pemesanan.

## 1. Tech Stack (Teknologi yang Digunakan Saat Ini)
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Bahasa Pemrograman:** JavaScript (ES Modules / `type: "module"`)
- **Database:** MySQL
- **ORM (Object Relational Mapping):** Sequelize
- **Autentikasi & Keamanan:** JSON Web Token (JWT) & bcrypt

## 2. Arsitektur & Struktur Direktori
Sistem ini mengadopsi arsitektur **MVC (Model-View-Controller)** pada lapisan backend (tanpa View). Struktur direktorinya adalah sebagai berikut:

- `config/` : Berisi pengaturan dan konfigurasi sistem (`database.js` untuk koneksi ke MySQL).
- `models/` : Berisi representasi tabel database ke dalam bentuk objek (Sequelize Models) beserta definisi relasinya.
- `controllers/` : Berisi *business logic* utama yang menerima input dari *request*, memanipulasi *model*, dan mengembalikan *response*.
- `routes/` : Berisi definisi *endpoint* API (URL) dan memetakannya ke *controller* yang tepat.
- `middlewares/` : Berisi fungsi perantara seperti `authMiddleware` (validasi JWT) dan `roleMiddleware` (pembatasan hak akses berdasar *role*).
- `database/` : Berisi file *dump* SQL (`kelompok1_db.sql`).

## 3. Detail Skema Database & Relasi
Sistem ini menggunakan relasi database yang terstruktur dengan 8 entitas utama:

1. **`users`** (Tabel Karyawan/Pengguna Sistem)
   - Kolom: `id`, `name`, `email`, `password`, `phone`, `status` (ENUM: active, inactive), `role` (ENUM: admin, technician, owner), `createdAt`, `updatedAt`
2. **`products`** (Tabel Suku Cadang / Barang)
   - Kolom: `id`, `name`, `description`, `price`, `stock`, `createdAt`, `updatedAt`
3. **`categories`** (Tabel Kategori Layanan)
   - Kolom: `id`, `name`, `parent_id`, `createdAt`, `updatedAt`
   - Relasi: *Self-referencing* (Parent-Child) melalui `parent_id`. 
4. **`services`** (Tabel Layanan/Jasa Servis)
   - Kolom: `id`, `name`, `description`, `price`, `category_id`, `createdAt`, `updatedAt`
   - Relasi: Memiliki relasi *Belongs-To* ke tabel `categories`.
5. **`customers`** (Tabel Pelanggan)
   - Kolom: `id`, `name`, `phone`, `createdAt`, `updatedAt`
6. **`customer_addresses`** (Tabel Alamat Pelanggan)
   - Kolom: `id`, `address`, `customer_id`, `createdAt`, `updatedAt`
   - Relasi: *Belongs-To* ke tabel `customers`. (Sistem mendukung 1 Customer memiliki banyak alamat).
7. **`booking_services`** (Tabel Induk Pemesanan/Invoice)
   - Kolom: `id`, `reg_no` (Nomor Registrasi), `status` (pending, confirmed, dll), `customer_id`, `booking_date`, `booking_time`, `total_price`, `notes`, `createdAt`, `updatedAt`
   - Relasi: Terhubung ke `customers` dan `customer_addresses`.
8. **`booking_units`** (Tabel Detail Unit yang Diservis)
   - Kolom: `id`, `brand_ac`, `type_ac`, `pk`, `lokasi`, `keluhan`, `price`, `booking_id`, `service_id`, `createdAt`, `updatedAt`
   - Relasi: *Belongs-To* ke `booking_services` (1 pesanan mencakup banyak unit) dan merujuk ke tabel `services`.

## 4. Alur Proses (Workflow) Saat Ini
Alur kerja yang telah diimplementasikan dalam sistem dan API saat ini terbagi berdasarkan otorisasi peran (Role-Based Access):

**A. Alur Admin & Owner**
- **Akses & Autentikasi:** Melakukan *Login* (POST `/api/auth/login`) untuk mendapatkan token (JWT). 
- **Kelola Data Master:** Menggunakan endpoint API yang terproteksi untuk melakukan manipulasi data (CRUD) pada:
  - Master Karyawan (`Users`), termasuk pendaftaran teknisi baru.
  - Master Suku Cadang (`Products`).
  - Master Layanan (`Categories` dan `Services`).
- **Proses Pesanan (Booking):** Admin bertugas menginputkan data pemesanan pelanggan ke dalam sistem, mencatat keluhan pada unit (AC), serta memperbarui status berjalannya pesanan.

**B. Alur Teknisi**
- Saat ini entitas Teknisi (*role: technician*) berstatus murni sebagai **Data Master** yang didaftarkan oleh admin di dalam tabel `users`.
- Teknisi secara sistematis belum diberikan akses untuk *Login* ke dalam sistem (jalur autentikasi diblokir secara eksplisit untuk *role* ini).

**C. Alur Akses Publik (Guest)**
- Semua jalur API di dalam sistem (*Categories, Services, Bookings, Users, Products*) saat ini tertutup penuh dan hanya dapat diakses dengan menggunakan token JWT tingkat Admin/Owner. Guest (pengunjung tanpa akses login) tidak memiliki alur penggunaan pada sistem ini.


