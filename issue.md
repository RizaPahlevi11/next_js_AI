# Feature Enhancement: Authentication UX (Public Homepage + Protected Features)

## 1. Context
Fitur ini merupakan revisi dari sistem authentication sebelumnya pada "Next.js Cinema Booking System" dengan Clean Architecture.

Perubahan utama:
- Aplikasi tidak lagi memaksa login di root (/)
- Homepage (/) bersifat PUBLIC
- Fitur tertentu tetap PROTECTED (butuh login)
- homepage cukup tuliskan "ini homepage", sampai perintah saya selanjutnya

Semua implementasi tetap WAJIB mengikuti layer:
- Presentation
- Application
- Data Access
- Infrastructure

---

## 2. Goal
Mengubah sistem authentication menjadi lebih user-friendly dengan:
- Public homepage
- Proteksi fitur penting
- Navigasi berbasis status login (navbar)

---

## 3. Functional Requirements

### A. Public Access (user)
user dapat mengakses:
- `/` (homepage)
- daftar film

user TIDAK dapat mengakses:
- detail film (opsional, bisa diproteksi)
- booking kursi
- halaman user lainnya

Jika user mencoba akses fitur protected:
→ redirect ke `/login`

---

### B. Authentication Flow (Tetap Sama)
- Register:
  - email
  - password (hashed)
  - role: USER
- Login:
  - validasi + compare password
  - redirect:
    - USER → `/`
    - ADMIN → `/admin`

---

### C. Protected Routes
Route berikut WAJIB login:
- `/booking`
- `/tickets`
- `/movies/[id]` (opsional proteksi)

---

### D. Navbar Behavior (IMPORTANT)

Navbar harus bersifat dinamis:

#### Jika user:
- Tampilkan:
  - Logo / Home
  - Button "Login"
  - Button "Register"

#### Jika User Login:
- Tampilkan:
  - Nama / Email user
  - Menu:
    - My Tickets
    - Logout


---

## 4. Technical Requirements

### A. Middleware Update
Ubah logic middleware:

- TIDAK lagi redirect `/` ke login
- Hanya protect route tertentu:

Contoh:
- protect:
  - `/booking`
  - `/tickets`
  - `/admin`
- allow:
  - `/`
  - `/login`
  - `/register`

---

### B. Session Handling
Gunakan Auth.js:
- Ambil session di server (Server Component)
- Gunakan untuk menentukan UI navbar

---

### C. UI Implementation (WAJIB SHADCN/UI)

#### Navbar Component:

Gunakan:
- Button (shadcn)
- DropdownMenu (untuk user menu)
- Avatar (optional)

---

### D. Homepage (`/`)
- tampilkan list film (dummy/static dulu boleh)
- tampilkan CTA:
  - "Login untuk booking tiket"

---

### E. Guarding UI (Client/Server)

Pada halaman protected:
- cek session
- jika tidak ada → redirect `/login`

---

## 5. Folder Addition

Tambahkan:

`src/components/shared/navbar.tsx`

---

## 6. Output Format

Berikan:

1. Update middleware (logic baru)
2. Navbar component (shadcn)
3. Contoh penggunaan session di layout
4. Contoh proteksi halaman booking
5. Penjelasan flow:
   - user vs admin

---

## 7. Constraints

- TypeScript wajib
- Clean Architecture tetap dijaga
- UI wajib shadcn/ui
- Tidak boleh hardcode auth logic di UI
- Harus scalable untuk fitur booking selanjutnya
