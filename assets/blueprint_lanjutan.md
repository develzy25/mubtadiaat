# Blueprint Arsitektur Build & CI/CD (Rencana Jangka Panjang)

Bagian ini menjadi standar baku (SOP) untuk eksekusi deployment dan _release_ aplikasi di tahap selanjutnya pasca-migrasi ke arsitektur Web Terpadu (Unified PWA).

## A. Otomatisasi GitHub Actions (CI/CD)

- **Multi-Platform Build:** Setiap push dengan Git Tag akan secara otomatis memicu pipeline CI/CD untuk menghasilkan:
  1. PWA Build (Web Terpadu untuk Akses Semua Peran: Admin hingga Mustahiq)
  2. Windows Desktop Installer (`.EXE`) via Electron
  3. Release Notes otomatis
  4. Publikasi ke GitHub Release.
- **Catatan Mobile:** Aplikasi tidak lagi di-build menjadi APK/AAB native. Pengguna Android (termasuk Mustahiq) akan menggunakan PWA yang bisa diinstal langsung dari _browser_ (Chrome/Safari) ke *Homescreen* HP mereka dengan pengalaman layaknya aplikasi *Native*.
- **Standar Versioning:** Wajib menggunakan akhiran **25** (Contoh: `v1.0.25`, `v1.1.25`).
- **Web Deployment:** Website Terpadu (Frontend) akan secara otomatis di-_deploy_ ke `mubtadiaat.pages.dev` melalui integrasi Cloudflare Pages di GitHub Actions.

## B. Standardisasi Installer Desktop Windows (.EXE)

- **Installer Engine:** Menggunakan **Electron Builder (NSIS)**.
- **Setup Wizard Profesional:** Meliputi halaman _Welcome_, _License_, _Browse Directory_, _Extraction Progress_, dan _Finish_.
- **Post-Install Options:** Pembuatan _Shortcut_ (Desktop, Start Menu) dan opsi "Jalankan Aplikasi Sekarang".
- **Sistem Auto Update (Penting):**
  - Aplikasi Desktop akan dibekali modul Auto Updater (`electron-updater`).
  - Memeriksa pembaruan secara _background_. Jika ada versi baru, memunculkan popup profesional dengan _changelog_.
  - Opsi: `Update Sekarang`, `Nanti`, `Lewati Versi Ini`.
  - Proses unduh & ekstrak dilakukan secara siluman (otomatis) _tanpa_ mengharuskan user mengunduh ulang installer secara manual dari website.
  - Sesi login (Token Better Auth), *cache* data lokal (Dexie), dan konfigurasi PWA tidak boleh terhapus pasca _update_.
