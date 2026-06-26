# IndCaffe API - First Time Setup

Sistem ini didesain tanpa menggunakan *fake data* atau *hardcoded users* untuk alasan keamanan. Saat pertama kali di-deploy, database akan kosong. Anda wajib mengikuti alur di bawah ini untuk inisialisasi awal.

## Alur Pendaftaran & Konfigurasi (First-Time Setup)

### LANGKAH 1: Run Aplikasi
Jalankan aplikasi via Maven (`mvnw spring-boot:run`). Hibernate (`ddl-auto=update`) akan secara otomatis membuat semua tabel yang dibutuhkan di database MySQL `indcaffe`. Selain itu, `DataSeeder` otomatis hanya akan meng-insert System Config standar (seperti *threshold_stok*, *expiry_alert_days*, dll).

### LANGKAH 2: Buat Akun ADMIN Pertama
Karena tabel `users` kosong, tidak ada yang bisa login. Anda harus membuat akun ADMIN pertama dengan melempar request ke endpoint khusus (sekali pakai):

**POST** `/api/auth/init-admin`
```json
{
  "username": "admin",
  "password": "supersecretpassword",
  "namaLengkap": "Administrator IndCaffe",
  "email": "admin@indcaffe.com"
}
```
*Catatan: Jika endpoint ini dipanggil saat database sudah memiliki minimal 1 user, sistem akan menolak (Return 403).*

### LANGKAH 3: Login sebagai ADMIN
Gunakan akun ADMIN yang baru saja Anda buat untuk login.
**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "supersecretpassword"
}
```
Anda akan mendapatkan **JWT Token**. Simpan token ini untuk mengakses endpoint berikutnya.

### LANGKAH 4: Buat Akun Staff & Master Data
Gunakan token ADMIN untuk menginisialisasi staff dan master data lainnya:
- Buat user MANAGER via `POST /api/admin/users`
- Buat user ADMIN_GUDANG via `POST /api/admin/users`
- Buat Kategori via `POST /api/admin/master/kategori` (Opsional)
- Buat Supplier via `POST /api/admin/master/supplier` (Opsional)

### LANGKAH 5: Inisialisasi Stok oleh Gudang
Admin Gudang (yang telah dibuat oleh ADMIN) kini dapat login, mendapatkan JWT, dan mulai menginput `Product` serta `Stok Awal` menggunakan endpoint `/api/gudang/barang-masuk`.

### LANGKAH 6: Pendaftaran Publik (Cafe, Mitra, Pelanggan)
Pengguna umum dapat langsung mendaftar sendiri secara mandiri tanpa campur tangan Admin melalui endpoint publik:
**POST** `/api/auth/register`
Pastikan menyertakan `type` ("CAFE", "MITRA", atau "PELANGGAN") dan mengisi data yang relevan (seperti Email wajib untuk Pelanggan).
