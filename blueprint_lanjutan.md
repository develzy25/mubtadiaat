# Blueprint Arsitektur Total & Rencana Implementasi

Berdasarkan arahan Anda, dokumen ini akan berfungsi sebagai **Blueprint Arsitektur Jangka Panjang** untuk fase pembangunan (*build*) dan juga **Rencana Implementasi Langsung** untuk fitur-fitur UI yang dapat dieksekusi saat ini.

> [!CAUTION]
> **Total Rebuild Phase (Mendatang)**
> Sesuai permintaan Anda, sebelum melanjutkan fase pengembangan tingkat lanjut (backend/deployment), kita akan melakukan **penghapusan dan reset total** terhadap Database Cloudflare D1 beserta API lama. Sistem basis data dan endpoint API akan dibangun ulang dari awal (0%) agar relasi data untuk platform Web, PWA, Android, dan iOS terintegrasi 100% tanpa sampah data/struktur lama.

---

## 1. Blueprint Arsitektur Build & CI/CD (Rencana Jangka Panjang)

Bagian ini menjadi standar baku (SOP) untuk eksekusi deployment dan *release* aplikasi di tahap selanjutnya.

### A. Otomatisasi GitHub Actions (CI/CD)
- **Multi-Platform Build:** Setiap push dengan Git Tag akan secara otomatis memicu pipeline CI/CD untuk menghasilkan:
  1. APK & AAB (Android)
  2. PWA Build (Web)
  3. Windows Desktop Installer (`.EXE`)
  4. Release Notes otomatis
  5. Publikasi ke GitHub Release.
- **Standar Versioning:** Wajib menggunakan akhiran **25** (Contoh: `v1.0.25`, `v1.1.25`).
- **Web Deployment:** Website (PWA/Admin) akan secara otomatis di-*deploy* ke `mubtadiaat.pages.dev` melalui integrasi Cloudflare Pages di GitHub Actions.

### B. Standardisasi Installer Desktop Windows (.EXE)
- **Installer Engine:** Menggunakan **Inno Setup** atau **NSIS**.
- **Setup Wizard Profesional:** Meliputi halaman *Welcome*, *License*, *Browse Directory*, *Extraction Progress*, dan *Finish*.
- **Post-Install Options:** Pembuatan *Shortcut* (Desktop, Start Menu, Taskbar) dan opsi "Jalankan Aplikasi Sekarang".
- **Sistem Auto Update (Penting):**
  - Aplikasi Desktop akan dibekali modul Auto Updater.
  - Memeriksa pembaruan secara _background_. Jika ada versi baru, memunculkan popup profesional dengan *changelog*.
  - Opsi: `Update Sekarang`, `Nanti`, `Lewati Versi Ini`.
  - Proses unduh & ekstrak dilakukan secara siluman (otomatis) *tanpa* mengharuskan user mengunduh ulang installer secara manual dari website.
  - Sesi login, database lokal (jika ada), dan konfigurasi tidak boleh terhapus pasca *update*.

---

## 2. Rencana Implementasi Langsung (Segera Dieksekusi)

Bagian ini adalah perbaikan UI/UX yang dapat langsung kita eksekusi pada sesi ini (saat pembangunan frontend ini).

### A. Perbaikan Bug (Linting)
- **[MODIFY]** `src/components/ui/PremiumSelect.tsx`
  - Memperbaiki peringatan class tailwind: mengubah `z-[99999]` menjadi standar `z-99999` yang lebih *clean*.

### B. Modernisasi Dashboard (Pintasan Manajemen)
- **[MODIFY]** `src/pages/AdminDashboard.tsx` (atau lokasi yang relevan jika berpindah)
  - **Reorganisasi Urutan Runtut:** Pintasan akan diurutkan secara logis dari hulu ke hilir:
    1. Master Pengurus (Asatidz) - *Data Induk Dasar*
    2. Master Kamar - *Data Induk Infrastruktur*
    3. Master Kelas & Rombel - *Data Induk KBM*
    4. Database Santri - *Data Hilir Transaksional*
  - **Indikator Persentase Kelengkapan:** Setiap kartu pintasan akan memiliki indikator persentase (sementara di-mock menggunakan perhitungan dasar) yang menunjukkan estimasi kelengkapan pengisian data di modul tersebut.
  - **Tombol Navigasi Langsung:** Menambahkan tombol ikon `->` (Arrow) atau `Isi Data Sekarang` yang elegan untuk memandu operator menuju menu yang belum lengkap secara instan.

---

## User Review Required

Apakah Blueprint CI/CD (versi `.25`, Installer Auto Update) serta Rencana Implementasi Dashboard ini sudah sesuai dengan visi jangka panjang Anda? Jika Anda memberikan persetujuan (Proceed), saya akan segera mengeksekusi **Rencana Implementasi Langsung (Bagian 2)** pada *codebase* frontend kita.
