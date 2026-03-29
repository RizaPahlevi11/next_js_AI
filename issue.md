# Feature: Admin Login & Authentication

## 1. Context & Goal
Kita perlu menambahkan fitur otentikasi khusus untuk role `ADMIN`. Admin tidak dapat melakukan registrasi mandiri (tidak ada halaman register admin di aplikasi publik). Proses otentikasi hanya dapat dilakukan melalui rute dan halaman khusus.

- **Halaman Login Admin**: `/admin/login`
- **Endpoint API Login Admin**: `POST /api/admin/login`

## 2. Aturan Bisnis (Business Rules)
1. **Validasi Kredensial**: Sistem harus memvalidasi format form email dan password.
2. **Pencarian User & Validasi Password**: Melakukan pengecekan ketersediaan user berdasarkan email di database (lewat *Repository*). Compare/bandingkan password yang di-submit dengan hash password di database.
3. **Pengecekan Role (CRITICAL)**: Setelah email dan password dinyatakan cocok, sistem **WAJIB** mengecek tipe `role` dari akun tersebut.
   - Jika role adalah `ADMIN` → Lanjutkan proses login.
   - Jika role **bukan** `ADMIN` (misalnya `USER`) → Tolak akses dan kembalikan error otorisasi.

## 3. API Contract

**HTTP Method:**
`POST`

**Endpoint:**
`/api/admin/login`

**Request Body:**
```json
{
  "email": "admin@cinema.com",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login admin berhasil",
  "data": {
    "id": "string",
    "email": "admin@cinema.com",
    "role": "ADMIN"
  }
}
```

**Response Error (401 - Invalid Credential):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

**Response Error (403 - Not Admin):**
```json
{
  "success": false,
  "message": "Unauthorized: bukan admin"
}
```

---

## 4. Tahapan Implementasi (Panduan untuk Developer / AI)

Untuk programmer junior atau model AI yang akan mengerjakan instruksi ini, WAJIB menjaga struktur bawaan **Clean Architecture** yang telah diterapkan. Berikut adalah panduan langkah demi langkah implementasinya:

### Tahap 1: Validasi Input (Validation Layer)
1. Buka file `src/validations/auth.schema.ts`.
2. Anda bisa memakai kembali skema `loginSchema` yang ada atau membuat skema yang baru jika dibutuhkan. Pastikan Zod memvalidasi tipe email dan minimal form password.

### Tahap 2: Logika Aplikasi (Service & Repository Layer)
1. Buka/buat repository: Pastikan `src/repositories/user.repository.ts` memiliki fungsi pencarian seperti `getUserByEmail(email: string)`.
2. Buka file `src/services/auth.service.ts`.
3. Ciptakan atau tambah sebuah fungsi khusus untuk flow login (misal: `adminLoginService(data)`).
   - Di dalam fungsi ini, gunakan metode dari `repository` untuk mendapatkan user.
   - Lakukan `bcrypt.compare` pada tahap ini. Bila gagal, *throw* error (dengan spesifikasi HTTP status 401).
   - **Terapkan Guard Role**: Panggil pengecekan jika `user.role !== "ADMIN"`. Bila ini terjadi, lempar standar error otorisasi (status 403).
   - Kembalikan objek data user dasar (id, email, role) jika semua verifikasi sukses.

### Tahap 3: Endpoint Next.js (Interface / Presentation Layer)
1. Buat direktori dan file baru sesuai struktur rute app router Next.js: `src/app/api/admin/login/route.ts`.
2. Implementasikan fungsi `export async function POST(req: Request)`.
3. Di dalam handler tersebut:
   - Parsing JSON body request.
   - Validasi body menggunakan schema Zod (Tahap 1).
   - Panggil logic service (Tahap 2).
   - Jika menggunakan `NextAuth`, Anda mungkin me-*redirect* logic otentikasi login ini ke standar penyusunan library auth, PASTIKAN standar contract form responsnya sesuai. Tetapi apabila endpoint dipisah benar-benar mandiri secara native, pastikan respons `NextResponse.json` kembaliannya tepat (200, 401, 403) sesuai API Contract di poin ke-3.

### Tahap 4: Halaman Frontend Admin (UI Presentation)
1. Buat halaman baru di lokasi `src/app/(admin)/admin/login/page.tsx` (sesuaikan letak agar tidak terpengaruh layout web utama secara tak disengaja).
2. Bangun User Interface (UI) form Login (Inputs & Button) menggunakan package standar *shadcn/ui* (dari `src/components/ui/...`).
3. Buat client-side *action* (bisa berupa form submission konvensional dengan fetch/axios atau perantara Next.js Server Action) yang meneruskan data ke rute `POST /api/admin/login`.
4. Jika response tidak sukses atau 401/403, tangkap errornya dan tampilkan di UI form menggunakan Toast atau Alert/Label Notifikasi merah.
5. Jika sukses (200), segera jalankan re-routing ke dashboard `/admin`.

### Tahap 5: Keamanan Global (Middleware Layer)
1. Buka file `src/middleware.ts`.
2. Bila belum dikonfigurasi, pastikan semua path rute dan haluan `/admin/*` **WAJIB** dicek token/session-nya.
3. Terutama, selain cek JWT, role dari decoded JWT token tersebut mutlak dibatasi untuk `"ADMIN"`. `USER` biasa yang mencoba masuk rute `/admin` patut di-redirect paksa kembali ke beranda `/`. Rute `/admin/login` dikecualikan dari status redirect log ini jika status *state* login belum diset oleh pengguna.
