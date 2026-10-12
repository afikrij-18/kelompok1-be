# Rencana Pengembangan Proyek (Plans)

Dokumen ini merangkum rencana-rencana fitur masa depan atau tambahan yang akan diimplementasikan pada proyek `kelompok1-be`.

---

## 1. Fitur Garansi Servis (`warranty-plan.md`)

### A. Latar Belakang
Menambahkan fitur garansi untuk setiap layanan servis yang diberikan kepada pelanggan guna meningkatkan kualitas layanan dan menyediakan pelacakan klaim.

### B. Kebijakan & Aturan Bisnis
1. **Durasi Garansi:** Ditentukan berdasarkan jenis layanan (`services.warranty_days` dalam satuan hari).
2. **Eksekusi:** Diberikan per unit yang diservis (`booking_units.warranty_expiry_date`).
3. **Penerbitan:** Otomatis diterbitkan saat status pesanan/booking berubah menjadi `completed`.
4. **Klaim & Pelacakan:** Karena peran user saat ini dibatasi untuk `admin` dan `owner`, klaim diajukan oleh staf atas laporan pelanggan dan dilacak melalui tabel riwayat klaim.

### C. Rancangan Perubahan Database
1. **Tabel `services`:** Tambah kolom `warranty_days` (INT, default 0).
2. **Tabel `booking_units`:** Tambah kolom `warranty_expiry_date` (DATEONLY, nullable).
3. **Tabel Baru `warranty_claims`:**
   - `id` (PK)
   - `booking_unit_id` (FK ke `booking_units`)
   - `claim_date` (DATEONLY)
   - `keluhan` (TEXT)
   - `status` (ENUM: `pending`, `approved`, `rejected`, `in_progress`, `completed`)
   - `created_by` (FK ke `users`)
   - `handled_by` (FK ke `users`, nullable)
   - `resolution_notes` (TEXT, nullable)
   - `createdAt` / `updatedAt`

### D. Alur Kerja (Workflow)
1. **Penerbitan Otomatis:**
   - Ketika status booking menjadi `completed`, sistem mengecek `services.warranty_days` dari setiap unit yang diservis.
   - Jika `warranty_days > 0`, dihitung `warranty_expiry_date = tanggal_completed + warranty_days`.
2. **Validasi Klaim:**
   - Saat Admin/Owner membuat klaim via `POST /api/warranty-claims`, sistem memvalidasi:
     - Apakah unit memiliki `warranty_expiry_date`?
     - Apakah garansi masih berlaku (`expiry_date >= hari_ini`)?
     - Apakah status booking sudah `completed`?
3. **Pelacakan (Tracking):**
   - Admin/Owner dapat melihat daftar klaim (`GET /api/warranty-claims`), melihat detail, dan memperbarui status penanganan (`PUT /api/warranty-claims/:id`).

### E. Daftar Endpoint yang Direncanakan
- `GET /api/warranties/check?booking_unit_id=...` (Cek status keaktifan garansi unit)
- `POST /api/warranty-claims` (Pengajuan klaim garansi)
- `GET /api/warranty-claims` (Daftar seluruh klaim garansi)
- `GET /api/warranty-claims/:id` (Detail klaim garansi)
- `PUT /api/warranty-claims/:id` (Update status/catatan penanganan klaim)
