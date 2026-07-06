PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_jenjang` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mufatish_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`mufatish_id`) REFERENCES `asatidz`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_jenjang`("id", "name", "mufatish_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "mundzir_id", "created_at", "updated_at", "deleted_at" FROM `jenjang`;--> statement-breakpoint
DROP TABLE `jenjang`;--> statement-breakpoint
ALTER TABLE `__new_jenjang` RENAME TO `jenjang`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tingkat` (
	`id` text PRIMARY KEY NOT NULL,
	`jenjang_id` text NOT NULL,
	`name` text NOT NULL,
	`target_nadzom` text,
	`target_bait` integer,
	`has_praktek` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tingkat`("id", "jenjang_id", "name", "target_nadzom", "target_bait", "has_praktek", "created_at", "updated_at", "deleted_at") SELECT "id", "jenjang_id", "name", "target_nadzom", "target_bait", "has_praktek", "created_at", "updated_at", "deleted_at" FROM `tingkat`;--> statement-breakpoint
DROP TABLE `tingkat`;--> statement-breakpoint
ALTER TABLE `__new_tingkat` RENAME TO `tingkat`;--> statement-breakpoint
ALTER TABLE `jadwal_pelajaran` ADD `kwartal` integer DEFAULT 1;