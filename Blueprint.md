# Mubtadi'at Blueprint
Version: 1.0 Enterprise
Status: Production Ready
Project: Pondok Pesantren Hidayatul Mubtadi'at Lirboyo

---

# Overview

Mubtadi'at merupakan aplikasi Progressive Web App (PWA) modern yang dirancang khusus sebagai media kerja digital bagi tenaga pendidik di lingkungan Pondok Pesantren Hidayatul Mubtadi'at Lirboyo.

Aplikasi ini bukan aplikasi administrasi.
Seluruh master data dikelola melalui Software Admin terpisah.
PWA hanya digunakan sebagai media operasional harian.

---

# Pengguna

## Mustahiq (Wali Kelas)
Bertugas mengelola seluruh aktivitas kelas yang diampu.
Hak akses:
- Dashboard, Profil, Jadwal Mengajar, Absensi Santri, Penilaian, Hafalan, Catatan Santri, Rekap Nilai, Rekap Absensi, e-Raport, Pengumuman, Agenda

## Munawwib (Guru Mata Pelajaran)
Hak akses:
- Dashboard, Jadwal Mengajar, Input Nilai, Input Hafalan, Catatan Pembelajaran, Rekap Nilai, Profil

## Mufatish (Pimpinan Tingkatan)
Hak akses monitoring (tidak melakukan administrasi data).
- Monitoring Absensi, Nilai, Hafalan, Aktivitas Guru, Statistik, Dashboard Monitoring

## Mundzir (Pimpinan Madrasah)
Hak akses monitoring keseluruhan. Melihat seluruh statistik tanpa mengelola master data.

---

# Bukan Fitur PWA

Seluruh fitur berikut DILARANG berada pada aplikasi PWA.
❌ Data Santri, Guru, Kelas, Kitab, Tahun Ajaran
❌ Manajemen User, Backup, Restore, Hak Akses, Setting Sistem, Konfigurasi
*(Semua dilakukan melalui Software Admin)*

---

# Tujuan Sistem

Membantu guru dalam: Absensi, Penilaian, Hafalan, Monitoring, Jadwal, Catatan, e-Raport, Komunikasi Internal dengan pengalaman pengguna yang sangat cepat, ringan dan modern.

---

# Technology Stack

## Frontend
React 19, Vite, TypeScript, React Router, TanStack Query, Zustand, React Hook Form, Zod, Dexie, Workbox, TailwindCSS v4, Framer Motion, Lucide React

## Backend
Cloudflare Workers, Hono.js, Drizzle ORM

## Database & Storage
Cloudflare D1 (SQLite), Cloudinary

## Authentication & Hosting
Better Auth, JWT, HttpOnly Cookie, Refresh Token, Cloudflare Pages, Cloudflare Workers

---

# Folder Structure

Menggunakan **Feature Based Architecture** untuk skalabilitas maksimal.

## Admin Frontend (`admin/src/`)
```text
├── assets/           # Images, icons, fonts
├── components/       # Global UI components (Design System)
├── config/           # Environment, constants
├── hooks/            # Global reusable hooks
├── layouts/          # Global layouts (DashboardLayout dll)
├── lib/              # 3rd party wrappers
├── pages/            # Page components
├── routes/           # Routing configuration
└── styles/           # Global CSS, Tailwind entry
```

## Mobile Frontend (`mobile/`)
Aplikasi PWA/Mobile menggunakan Expo React Native.
```text
├── app/              # Expo Router pages
├── assets/           # Images, fonts
├── components/       # UI Components
├── hooks/            # Custom hooks
└── lib/              # Utility functions
```

## Backend (`backend/src/`)
Menggunakan **Domain Driven / Clean Architecture**.
```text
├── domain/           # Entities, models, interfaces
├── repositories/     # Database access layer
├── services/         # Business logic layer
├── controllers/      # Request handler
├── middleware/       # Hono middlewares (Auth, Logger)
├── routes/           # API routes definition
└── db/               # Drizzle schema, connection
```

## Dokumentasi (`docs/`)
```text
├── architecture.md
├── api.md
├── database.md
├── deployment.md
├── design-system.md
├── coding-standard.md
├── contributing.md
├── security.md
├── offline.md
├── cloudinary.md
├── d1.md
└── workers.md
```

---

# Backend Architecture Principles

1. **Repository Pattern:** Akses Drizzle ORM dibungkus dalam repository (`AttendanceRepository`, `GradeRepository`, `UserRepository`) agar ORM bisa diganti kapan saja.
2. **Service Layer:** Business logic berada di Service (`AttendanceService`, `GradeService`, `DashboardService`, `CloudinaryService`, `NotificationService`).
3. **Route Flow:** `Route -> Service -> Repository`. (Contoh: Route -> Service -> Cloudinary -> Repository). Route dilarang memanggil ORM atau Cloudinary secara langsung.
4. **Single Request Dashboard:** `DashboardService` menghasilkan satu response utuh (summary, schedule, announcement, statistics, activity) agar frontend cukup sekali request.

---

# Database Schema (Cloudflare D1)

Setiap tabel **wajib** menggunakan `UUID` untuk Primary Key dan `deleted_at` untuk Soft Delete.

Tabel yang akan dibuat:
- `users`, `roles`, `permissions`, `role_permissions`, `user_roles` (RBAC Lengkap)
- `santri_refs`, `kelas_refs`, `kitab_refs` (Referensi master data)
- `attendance`, `attendance_details`
- `grades`, `grade_items`
- `memorization`, `memorization_items`
- `reports`
- `activities` (Activity Log pengguna)
- `notifications`, `notification_reads` (Notification Center)
- `audit_logs` (Rekam jejak perubahan krusial data)
- `media` (Cloudinary metadata)
- `offline_queue`, `offline_failed`, `offline_logs` (Manajemen offline yang terperinci)
- `sync_queue`
- `feature_flags` (Toggle fitur secara dinamis)
- `settings`, `sessions`, `refresh_tokens`

---

# Logging & Auditing

1. **Audit Logs (`audit_logs`):** Melacak perubahan krusial (siapa mengubah apa).
   Format: `id, user_id, role, activity, table_name, record_id, old_data, new_data, ip_address, device, created_at`
2. **Activity Logs (`activities`):** Melacak aktivitas harian pengguna (Contoh: Input Nilai, Input Hafalan, Absen, Login) untuk ditampilkan di widget dashboard.

---

# API Layer & Caching (Frontend)

- **API Services:** Semua request API dipisahkan di folder `services/` (misal `attendance.api.ts`, `dashboard.api.ts`).
- **Cache Management:** Folder khusus `cache/` atau `query/` disediakan untuk konfigurasi dan key factory TanStack Query.

---

# UI Design System, Theme, & Tokens

Pisahkan ke package/folder internal agar seluruh aplikasi menggunakan standar yang sama. Dilarang hardcode warna atau ukuran.

**Design Tokens (`src/tokens/`)**
- `color.ts`, `shadow.ts`, `spacing.ts`, `radius.ts`, `z-index.ts`, `font.ts`, `motion.ts`

**Design Theme (`src/theme/`)**
- Implementasi token ke dalam variabel Tailwind/CSS.

**UI Components (`src/components/ui/`)**
- Button, Card, Input, Modal, Avatar, Badge, Drawer, Dialog, Toast, Skeleton, Loading, Timeline, Chart, Table, BottomNavigation, QuickAction, FloatingMenu, GlassContainer, StatCard, WidgetCard, ProfileCard.

**Error Boundaries (`src/components/`)**
- `ErrorBoundary`, `AppError`, `NotFound`, `Forbidden`, `Unauthorized`.

---

# Dashboard Layout & Widgets

1. **Standard Layout:** Semua dashboard memakai layout yang sama:
   `DashboardLayout -> Header -> Summary -> Widgets -> Quick Menu -> Bottom Navigation`
2. **Reusable Widgets:** Widget jangan di-hardcode. Buat komponen mandiri di `src/components/widgets/` seperti `AttendanceWidget`, `StatisticsWidget`, `ScheduleWidget`, `AnnouncementWidget`, `ActivityWidget`.

---

# Offline First

Menggunakan IndexedDB, Dexie, dan Background Sync.
Antrian mutasi saat offline dicatat dalam `offline_queue`, log kegagalan dalam `offline_failed`, dan riwayat dalam `offline_logs`.

---

# Cloudinary Storage

File dihapus menggunakan API Cloudinary melalui `CloudinaryService`.
Database `media` **wajib** menyimpan field berikut untuk mempermudah migrasi ke platform lain (seperti R2) di masa depan:
- `public_id`, `secure_url`, `bytes`, `width`, `height`, `folder`, `format`
- `provider`, `provider_id`, `mime_type`, `extension`, `etag`, `version`, `signature`, `resource_type`, `uploaded_at`

---

# Security & Performance

- JWT, HttpOnly Cookie, CSRF, XSS, Rate Limit, Validation, Sanitization.
- Target skor Lighthouse 95+ (Performance), 100 (Accessibility, SEO, Best Practice).

---

# Development Principle

- Mobile First & Offline First.
- API First.
- Component Driven Development.
- Feature Based Architecture.
- Clean Architecture (Repository & Service layers).
- SOLID, DRY, KISS, Separation of Concerns.
- Enterprise Coding Standard (Strict TS, ESLint).

---

# Final Goal

Menghasilkan aplikasi PWA enterprise yang terasa seperti aplikasi Android premium, memiliki UI/UX eksklusif dengan Soft UI, Neumorphism, Glassmorphism, Floating 3D Card, animasi halus, performa tinggi, offline-first, scalable, dan siap digunakan dalam lingkungan produksi jangka panjang.