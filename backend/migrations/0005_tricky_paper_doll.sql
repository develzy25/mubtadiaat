CREATE TABLE `kelulusan_ijazah` (
	`id` text PRIMARY KEY NOT NULL,
	`santri_id` text NOT NULL,
	`kelas_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`rata_rata_smt1` real,
	`rata_rata_smt2` real,
	`rata_rata_akhir` real,
	`lulus_praktik` integer DEFAULT false,
	`lulus_alquran` integer DEFAULT false,
	`lulus_kitab` integer DEFAULT false,
	`lulus_khidmah` integer DEFAULT false,
	`lulus` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kelulusan_sertifikat` (
	`id` text PRIMARY KEY NOT NULL,
	`santri_id` text NOT NULL,
	`kelas_id` text NOT NULL,
	`academic_year` text NOT NULL,
	`nilai_ujian` real,
	`nilai_qiroah` real,
	`nilai_muhafadhoh` real,
	`rata_rata` real,
	`lulus` integer DEFAULT false,
	`penempatan` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON UPDATE no action ON DELETE no action
);
