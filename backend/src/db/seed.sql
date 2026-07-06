-- 1. Insert Asatidz (Mustahiq & Munawwibah)
INSERT INTO asatidz (id, name, status) VALUES 
('ast_charis', 'Bpk. Charis Wahyudi', 'ACTIVE'),
('ast_abdurrahman', 'Bpk. Abdurrahman Addakhel', 'ACTIVE'),
('ast_ahmad_ilmi', 'Bpk. Ahmad Ilmi Nuroni', 'ACTIVE'),
('ast_aji', 'Bpk. Aji Prio Pangestu', 'ACTIVE'),
('ast_shoddiq', 'Bpk. Muhammad Shoddiq Asyhari', 'ACTIVE'),
('ast_salman', 'Bpk. Salman Al Farisy', 'ACTIVE'),
('ast_alex', 'Bpk. Alex Rizquna', 'ACTIVE'),
('ast_zidna', 'Bpk. Zidna Farhan Biknada', 'ACTIVE'),
('ast_ali', 'Bpk. Ali Ya''lu', 'ACTIVE'),
('ast_lulu', 'Ibu Lulu Izzatul Fikriyah', 'ACTIVE'),
('ast_siti_khodijah', 'Ibu Siti Khodijah', 'ACTIVE'),
('ast_ummi_saadah', 'Ibu Hj. Ummi Sa''adah Sa''di', 'ACTIVE'),
('ast_nur_fathma', 'Ibu Hj. Nur Fathma', 'ACTIVE'),
('ast_aida', 'Ibu Aida Masyitoh', 'ACTIVE'),
('ast_muyasaroh', 'Ibu Muyasaroh', 'ACTIVE'),
('ast_siti_sarah', 'Ibu Siti Sarah Fadilah', 'ACTIVE'),
('ast_liyana', 'Ibu Liyana Ma''rifatun', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- 2. Insert Jenjang & Tingkat
INSERT INTO jenjang (id, name) VALUES ('jjg_tsanawiyah', 'Tsanawiyah') ON CONFLICT DO NOTHING;
INSERT INTO tingkat (id, jenjang_id, name) VALUES ('tkt_ts_1', 'jjg_tsanawiyah', 'I') ON CONFLICT DO NOTHING;

-- 3. Insert Kelas
INSERT INTO kelas (id, tingkat_id, bagian, lokal, mustahiq_id) VALUES 
('kls_ts1_a', 'tkt_ts_1', 'A', 'Lokal 01', 'ast_charis'),
('kls_ts1_b', 'tkt_ts_1', 'B', 'Lokal 02', 'ast_abdurrahman'),
('kls_ts1_c', 'tkt_ts_1', 'C', 'Lokal 03', 'ast_ahmad_ilmi'),
('kls_ts1_d', 'tkt_ts_1', 'D', 'Lokal 04', 'ast_aji'),
('kls_ts1_e', 'tkt_ts_1', 'E', 'Lokal 05', 'ast_shoddiq'),
('kls_ts1_f', 'tkt_ts_1', 'F', 'Lokal 06', 'ast_salman'),
('kls_ts1_g', 'tkt_ts_1', 'G', 'Lokal 07', 'ast_alex'),
('kls_ts1_h', 'tkt_ts_1', 'H', 'Lokal 08', 'ast_zidna'),
('kls_ts1_i', 'tkt_ts_1', 'I', 'Lokal 09', 'ast_ali')
ON CONFLICT DO NOTHING;

-- 4. Insert Kitab
INSERT INTO kitab (id, tingkat_id, name) VALUES 
('ktb_mukhtashor', 'tkt_ts_1', 'Mukhtashor Jiddan'),
('ktb_fathul', 'tkt_ts_1', 'Fathul Mubin'),
('ktb_khoridah', 'tkt_ts_1', 'Al-Khoridah Al-Bahiyyah / Mukhtashor Jiddan'),
('ktb_sullam', 'tkt_ts_1', 'Sullam Taufiq'),
('ktb_qowaid', 'tkt_ts_1', 'Qowa''id As-Shorfiyyah'),
('ktb_bulughul', 'tkt_ts_1', 'Bulughul Marom'),
('ktb_tashrif', 'tkt_ts_1', 'Tashrif Al-Ishthilahi'),
('ktb_washoya', 'tkt_ts_1', 'Washoya Al-Abaa'' lil Abnaa'''),
('ktb_ilal', 'tkt_ts_1', 'Al-I''lal'),
('ktb_tuhfah', 'tkt_ts_1', 'Tuhfah al-Athfal / Al-Qur''an')
ON CONFLICT DO NOTHING;

-- 5. Insert Jadwal Pelajaran (Kelas A)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_a_sabtu_1', 'kls_ts1_a', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_charis', '2025-2026'),
('jdw_a_sabtu_2', 'kls_ts1_a', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_muyasaroh', '2025-2026'),
('jdw_a_ahad_1', 'kls_ts1_a', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_charis', '2025-2026'),
('jdw_a_ahad_2', 'kls_ts1_a', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_charis', '2025-2026'),
('jdw_a_senin_1', 'kls_ts1_a', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_charis', '2025-2026'),
('jdw_a_senin_2', 'kls_ts1_a', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_charis', '2025-2026'),
('jdw_a_selasa_1', 'kls_ts1_a', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_charis', '2025-2026'),
('jdw_a_selasa_2', 'kls_ts1_a', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_ummi_saadah', '2025-2026'),
('jdw_a_rabu_1', 'kls_ts1_a', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_charis', '2025-2026'),
('jdw_a_rabu_2', 'kls_ts1_a', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_charis', '2025-2026'),
('jdw_a_kamis_1', 'kls_ts1_a', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_charis', '2025-2026'),
('jdw_a_kamis_2', 'kls_ts1_a', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_lulu', '2025-2026');

-- Jadwal Pelajaran (Kelas B)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_b_sabtu_1', 'kls_ts1_b', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_abdurrahman', '2025-2026'),
('jdw_b_sabtu_2', 'kls_ts1_b', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_siti_sarah', '2025-2026'),
('jdw_b_ahad_1', 'kls_ts1_b', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_abdurrahman', '2025-2026'),
('jdw_b_ahad_2', 'kls_ts1_b', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_abdurrahman', '2025-2026'),
('jdw_b_senin_1', 'kls_ts1_b', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_abdurrahman', '2025-2026'),
('jdw_b_senin_2', 'kls_ts1_b', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_abdurrahman', '2025-2026'),
('jdw_b_selasa_1', 'kls_ts1_b', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_abdurrahman', '2025-2026'),
('jdw_b_selasa_2', 'kls_ts1_b', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_ummi_saadah', '2025-2026'),
('jdw_b_rabu_1', 'kls_ts1_b', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_abdurrahman', '2025-2026'),
('jdw_b_rabu_2', 'kls_ts1_b', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_abdurrahman', '2025-2026'),
('jdw_b_kamis_1', 'kls_ts1_b', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_abdurrahman', '2025-2026'),
('jdw_b_kamis_2', 'kls_ts1_b', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_lulu', '2025-2026');

-- Jadwal Pelajaran (Kelas C)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_c_sabtu_1', 'kls_ts1_c', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_sabtu_2', 'kls_ts1_c', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_siti_sarah', '2025-2026'),
('jdw_c_ahad_1', 'kls_ts1_c', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_ahad_2', 'kls_ts1_c', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_senin_1', 'kls_ts1_c', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_senin_2', 'kls_ts1_c', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_selasa_1', 'kls_ts1_c', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_selasa_2', 'kls_ts1_c', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_nur_fathma', '2025-2026'),
('jdw_c_rabu_1', 'kls_ts1_c', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_rabu_2', 'kls_ts1_c', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_kamis_1', 'kls_ts1_c', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_ahmad_ilmi', '2025-2026'),
('jdw_c_kamis_2', 'kls_ts1_c', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_lulu', '2025-2026');

-- Jadwal Pelajaran (Kelas D)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_d_sabtu_1', 'kls_ts1_d', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_aji', '2025-2026'),
('jdw_d_sabtu_2', 'kls_ts1_d', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_siti_sarah', '2025-2026'),
('jdw_d_ahad_1', 'kls_ts1_d', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_aji', '2025-2026'),
('jdw_d_ahad_2', 'kls_ts1_d', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_aji', '2025-2026'),
('jdw_d_senin_1', 'kls_ts1_d', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_aji', '2025-2026'),
('jdw_d_senin_2', 'kls_ts1_d', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_aji', '2025-2026'),
('jdw_d_selasa_1', 'kls_ts1_d', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_aji', '2025-2026'),
('jdw_d_selasa_2', 'kls_ts1_d', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_nur_fathma', '2025-2026'),
('jdw_d_rabu_1', 'kls_ts1_d', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_aji', '2025-2026'),
('jdw_d_rabu_2', 'kls_ts1_d', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_aji', '2025-2026'),
('jdw_d_kamis_1', 'kls_ts1_d', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_aji', '2025-2026'),
('jdw_d_kamis_2', 'kls_ts1_d', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_lulu', '2025-2026');

-- Jadwal Pelajaran (Kelas E)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_e_sabtu_1', 'kls_ts1_e', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_shoddiq', '2025-2026'),
('jdw_e_sabtu_2', 'kls_ts1_e', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_siti_sarah', '2025-2026'),
('jdw_e_ahad_1', 'kls_ts1_e', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_shoddiq', '2025-2026'),
('jdw_e_ahad_2', 'kls_ts1_e', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_shoddiq', '2025-2026'),
('jdw_e_senin_1', 'kls_ts1_e', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_shoddiq', '2025-2026'),
('jdw_e_senin_2', 'kls_ts1_e', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_shoddiq', '2025-2026'),
('jdw_e_selasa_1', 'kls_ts1_e', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_shoddiq', '2025-2026'),
('jdw_e_selasa_2', 'kls_ts1_e', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_nur_fathma', '2025-2026'),
('jdw_e_rabu_1', 'kls_ts1_e', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_shoddiq', '2025-2026'),
('jdw_e_rabu_2', 'kls_ts1_e', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_shoddiq', '2025-2026'),
('jdw_e_kamis_1', 'kls_ts1_e', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_shoddiq', '2025-2026'),
('jdw_e_kamis_2', 'kls_ts1_e', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_siti_khodijah', '2025-2026');

-- Jadwal Pelajaran (Kelas F)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_f_sabtu_1', 'kls_ts1_f', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_salman', '2025-2026'),
('jdw_f_sabtu_2', 'kls_ts1_f', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_liyana', '2025-2026'),
('jdw_f_ahad_1', 'kls_ts1_f', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_salman', '2025-2026'),
('jdw_f_ahad_2', 'kls_ts1_f', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_salman', '2025-2026'),
('jdw_f_senin_1', 'kls_ts1_f', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_salman', '2025-2026'),
('jdw_f_senin_2', 'kls_ts1_f', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_salman', '2025-2026'),
('jdw_f_selasa_1', 'kls_ts1_f', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_salman', '2025-2026'),
('jdw_f_selasa_2', 'kls_ts1_f', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_nur_fathma', '2025-2026'),
('jdw_f_rabu_1', 'kls_ts1_f', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_salman', '2025-2026'),
('jdw_f_rabu_2', 'kls_ts1_f', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_salman', '2025-2026'),
('jdw_f_kamis_1', 'kls_ts1_f', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_salman', '2025-2026'),
('jdw_f_kamis_2', 'kls_ts1_f', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_siti_khodijah', '2025-2026');

-- Jadwal Pelajaran (Kelas G)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_g_sabtu_1', 'kls_ts1_g', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_alex', '2025-2026'),
('jdw_g_sabtu_2', 'kls_ts1_g', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_liyana', '2025-2026'),
('jdw_g_ahad_1', 'kls_ts1_g', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_alex', '2025-2026'),
('jdw_g_ahad_2', 'kls_ts1_g', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_alex', '2025-2026'),
('jdw_g_senin_1', 'kls_ts1_g', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_alex', '2025-2026'),
('jdw_g_senin_2', 'kls_ts1_g', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_alex', '2025-2026'),
('jdw_g_selasa_1', 'kls_ts1_g', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_alex', '2025-2026'),
('jdw_g_selasa_2', 'kls_ts1_g', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_nur_fathma', '2025-2026'),
('jdw_g_rabu_1', 'kls_ts1_g', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_alex', '2025-2026'),
('jdw_g_rabu_2', 'kls_ts1_g', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_alex', '2025-2026'),
('jdw_g_kamis_1', 'kls_ts1_g', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_alex', '2025-2026'),
('jdw_g_kamis_2', 'kls_ts1_g', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_siti_khodijah', '2025-2026');

-- Jadwal Pelajaran (Kelas H)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_h_sabtu_1', 'kls_ts1_h', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_zidna', '2025-2026'),
('jdw_h_sabtu_2', 'kls_ts1_h', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_liyana', '2025-2026'),
('jdw_h_ahad_1', 'kls_ts1_h', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_zidna', '2025-2026'),
('jdw_h_ahad_2', 'kls_ts1_h', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_zidna', '2025-2026'),
('jdw_h_senin_1', 'kls_ts1_h', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_zidna', '2025-2026'),
('jdw_h_senin_2', 'kls_ts1_h', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_zidna', '2025-2026'),
('jdw_h_selasa_1', 'kls_ts1_h', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_zidna', '2025-2026'),
('jdw_h_selasa_2', 'kls_ts1_h', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_aida', '2025-2026'),
('jdw_h_rabu_1', 'kls_ts1_h', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_zidna', '2025-2026'),
('jdw_h_rabu_2', 'kls_ts1_h', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_zidna', '2025-2026'),
('jdw_h_kamis_1', 'kls_ts1_h', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_zidna', '2025-2026'),
('jdw_h_kamis_2', 'kls_ts1_h', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_siti_khodijah', '2025-2026');

-- Jadwal Pelajaran (Kelas I)
INSERT INTO jadwal_pelajaran (id, kelas_id, kitab_id, hari, sesi, pengajar_id, academic_year) VALUES 
('jdw_i_sabtu_1', 'kls_ts1_i', 'ktb_mukhtashor', 'Sabtu', 'Sesi 1', 'ast_ali', '2025-2026'),
('jdw_i_sabtu_2', 'kls_ts1_i', 'ktb_fathul', 'Sabtu', 'Sesi 2', 'ast_liyana', '2025-2026'),
('jdw_i_ahad_1', 'kls_ts1_i', 'ktb_khoridah', 'Ahad', 'Sesi 1', 'ast_ali', '2025-2026'),
('jdw_i_ahad_2', 'kls_ts1_i', 'ktb_sullam', 'Ahad', 'Sesi 2', 'ast_ali', '2025-2026'),
('jdw_i_senin_1', 'kls_ts1_i', 'ktb_qowaid', 'Senin', 'Sesi 1', 'ast_ali', '2025-2026'),
('jdw_i_senin_2', 'kls_ts1_i', 'ktb_bulughul', 'Senin', 'Sesi 2', 'ast_ali', '2025-2026'),
('jdw_i_selasa_1', 'kls_ts1_i', 'ktb_tashrif', 'Selasa', 'Sesi 1', 'ast_ali', '2025-2026'),
('jdw_i_selasa_2', 'kls_ts1_i', 'ktb_washoya', 'Selasa', 'Sesi 2', 'ast_aida', '2025-2026'),
('jdw_i_rabu_1', 'kls_ts1_i', 'ktb_ilal', 'Rabu', 'Sesi 1', 'ast_ali', '2025-2026'),
('jdw_i_rabu_2', 'kls_ts1_i', 'ktb_bulughul', 'Rabu', 'Sesi 2', 'ast_ali', '2025-2026'),
('jdw_i_kamis_1', 'kls_ts1_i', 'ktb_sullam', 'Kamis', 'Sesi 1', 'ast_ali', '2025-2026'),
('jdw_i_kamis_2', 'kls_ts1_i', 'ktb_tuhfah', 'Kamis', 'Sesi 2', 'ast_siti_khodijah', '2025-2026');
