CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `asatidz` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`nip` text,
	`phone` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`kelas_id` text NOT NULL,
	`month` text NOT NULL,
	`recorded_by_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recorded_by_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `attendance_details` (
	`id` text PRIMARY KEY NOT NULL,
	`attendance_id` text NOT NULL,
	`santri_id` text NOT NULL,
	`hadir` integer DEFAULT 0 NOT NULL,
	`sakit` integer DEFAULT 0 NOT NULL,
	`izin` integer DEFAULT 0 NOT NULL,
	`alpha` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`role` text,
	`activity` text NOT NULL,
	`table_name` text NOT NULL,
	`record_id` text NOT NULL,
	`old_data` text,
	`new_data` text,
	`ip_address` text,
	`device` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `blok` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `jadwal_pelajaran` (
	`id` text PRIMARY KEY NOT NULL,
	`kelas_id` text NOT NULL,
	`kitab_id` text NOT NULL,
	`hari` text NOT NULL,
	`sesi` text NOT NULL,
	`pengajar_id` text,
	`academic_year` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kitab_id`) REFERENCES `kitab`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pengajar_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `jenjang` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mundzir_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`mundzir_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `kamar` (
	`id` text PRIMARY KEY NOT NULL,
	`blok_id` text NOT NULL,
	`name` text NOT NULL,
	`penasihat_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`blok_id`) REFERENCES `blok`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`penasihat_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `kelas` (
	`id` text PRIMARY KEY NOT NULL,
	`tingkat_id` text NOT NULL,
	`bagian` text NOT NULL,
	`mustahiq_id` text,
	`munawwib_ids` text,
	`lokal` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tingkat_id`) REFERENCES `tingkat`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mustahiq_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `kitab` (
	`id` text PRIMARY KEY NOT NULL,
	`tingkat_id` text NOT NULL,
	`name` text NOT NULL,
	`fan_ilmu` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`tingkat_id`) REFERENCES `tingkat`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rapot_nilai` (
	`id` text PRIMARY KEY NOT NULL,
	`rapot_id` text NOT NULL,
	`kitab_id` text NOT NULL,
	`kuartal_1_score` real,
	`kuartal_2_score` real,
	`kuartal_3_score` real,
	`kuartal_4_score` real,
	`khosh_score` real,
	`am_score` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`rapot_id`) REFERENCES `rapot_semester`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kitab_id`) REFERENCES `kitab`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rapot_semester` (
	`id` text PRIMARY KEY NOT NULL,
	`santri_id` text NOT NULL,
	`kelas_id` text NOT NULL,
	`semester` text NOT NULL,
	`academic_year` text NOT NULL,
	`izin_count` integer DEFAULT 0,
	`tanpa_izin_count` integer DEFAULT 0,
	`nilai_akhlaq` real DEFAULT 8,
	`nilai_prestasi` real,
	`is_finalized` integer DEFAULT false,
	`catatan` text,
	`recorded_by_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recorded_by_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `santri` (
	`id` text PRIMARY KEY NOT NULL,
	`no_stambuk` text,
	`nik` text,
	`name` text NOT NULL,
	`tempat_lahir` text,
	`tanggal_lahir` text,
	`alamat_lengkap` text,
	`provinsi` text,
	`kabupaten` text,
	`kecamatan` text,
	`kelurahan` text,
	`kode_pos` text,
	`no_kk` text,
	`nama_ayah` text,
	`nama_ibu` text,
	`tahun_masuk` text,
	`tahun_keluar` text,
	`kelas_id` text,
	`kamar_id` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`custom_fields` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`kamar_id`) REFERENCES `kamar`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tingkat` (
	`id` text PRIMARY KEY NOT NULL,
	`jenjang_id` text NOT NULL,
	`name` text NOT NULL,
	`mufatish_id` text,
	`target_nadzom` text,
	`target_bait` integer,
	`has_praktek` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mufatish_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` integer DEFAULT 4,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
