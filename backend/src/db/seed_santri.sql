-- 1. Insert Blok
INSERT INTO blok (id, name) VALUES 
('blk_1', 'Blok A (Utama)'),
('blk_2', 'Blok B (Barat)');

-- 2. Insert Kamar
INSERT INTO kamar (id, name, blok_id, penasihat_id) VALUES 
('kmr_1', 'Kamar A.01', 'blk_1', 'ast_charis'),
('kmr_2', 'Kamar A.02', 'blk_1', 'ast_abdurrahman'),
('kmr_3', 'Kamar B.01', 'blk_2', 'ast_ahmad_ilmi');

-- 3. Insert Santri
INSERT INTO santri (id, no_stambuk, nik, name, alamat_lengkap, kelas_id, kamar_id, status, tahun_keluar) VALUES 
('str_1', '20250001', '3512340001', 'Aisyah Putri', 'Kudus', 'kls_ts1_a', 'kmr_1', 'ACTIVE', NULL),
('str_2', '20250002', '3512340002', 'Siti Fatimah', 'Demak', 'kls_ts1_a', 'kmr_1', 'ACTIVE', NULL),
('str_3', '20250003', '3512340003', 'Nurul Huda', 'Pati', 'kls_ts1_b', 'kmr_2', 'ACTIVE', NULL),
('str_4', '20250004', '3512340004', 'Nabila Khoirunnisa', 'Semarang', 'kls_ts1_c', 'kmr_3', 'ACTIVE', NULL),
('str_5', '20250005', '3512340005', 'Rina Wati', 'Jepara', 'kls_ts1_d', 'kmr_2', 'CUTI', NULL),
('str_6', '20250006', '3512340006', 'Laila Lathifa', 'Grobogan', 'kls_ts1_e', 'kmr_3', 'BOYONG', '2024'),
('str_7', '20250007', '3512340007', 'Zahra Ramadhani', 'Kendal', 'kls_ts1_a', 'kmr_1', 'ACTIVE', NULL),
('str_8', '20250008', '3512340008', 'Putri Salsabila', 'Rembang', 'kls_ts1_b', 'kmr_2', 'ACTIVE', NULL);
