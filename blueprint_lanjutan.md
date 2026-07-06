# Blueprint Arsitektur Total & Rencana Implementasi

Berdasarkan arahan Anda, dokumen ini akan berfungsi sebagai **Blueprint Arsitektur Jangka Panjang** untuk fase pembangunan (_build_) dan juga **Rencana Implementasi Langsung** untuk fitur-fitur UI yang dapat dieksekusi saat ini.

> [!CAUTION]
> **Total Rebuild Phase (Mendatang)**
> Sesuai permintaan Anda, sebelum melanjutkan fase pengembangan tingkat lanjut (backend/deployment), kita akan melakukan **penghapusan dan reset total** terhadap Database Cloudflare D1 beserta API lama. Sistem basis data dan endpoint API akan dibangun ulang dari awal (0%) agar relasi data untuk platform Web, PWA, Android, dan iOS terintegrasi 100% tanpa sampah data/struktur lama.

---

## 1. Blueprint Arsitektur Build & CI/CD (Rencana Jangka Panjang)

Bagian ini menjadi standar baku (SOP) untuk eksekusi deployment dan _release_ aplikasi di tahap selanjutnya.

### A. Otomatisasi GitHub Actions (CI/CD)

- **Multi-Platform Build:** Setiap push dengan Git Tag akan secara otomatis memicu pipeline CI/CD untuk menghasilkan:
  1. APK & AAB (Android)
  2. PWA Build (Web)
  3. Windows Desktop Installer (`.EXE`)
  4. Release Notes otomatis
  5. Publikasi ke GitHub Release.
- **Standar Versioning:** Wajib menggunakan akhiran **25** (Contoh: `v1.0.25`, `v1.1.25`).
- **Web Deployment:** Website (PWA/Admin) akan secara otomatis di-_deploy_ ke `mubtadiaat.pages.dev` melalui integrasi Cloudflare Pages di GitHub Actions.

### B. Standardisasi Installer Desktop Windows (.EXE)

- **Installer Engine:** Menggunakan **Inno Setup** atau **NSIS**.
- **Setup Wizard Profesional:** Meliputi halaman _Welcome_, _License_, _Browse Directory_, _Extraction Progress_, dan _Finish_.
- **Post-Install Options:** Pembuatan _Shortcut_ (Desktop, Start Menu, Taskbar) dan opsi "Jalankan Aplikasi Sekarang".
- **Sistem Auto Update (Penting):**
  - Aplikasi Desktop akan dibekali modul Auto Updater.
  - Memeriksa pembaruan secara _background_. Jika ada versi baru, memunculkan popup profesional dengan _changelog_.
  - Opsi: `Update Sekarang`, `Nanti`, `Lewati Versi Ini`.
  - Proses unduh & ekstrak dilakukan secara siluman (otomatis) _tanpa_ mengharuskan user mengunduh ulang installer secara manual dari website.
  - Sesi login, database lokal (jika ada), dan konfigurasi tidak boleh terhapus pasca _update_.
