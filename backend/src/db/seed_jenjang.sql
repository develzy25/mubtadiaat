-- Insert Missing Jenjang
INSERT INTO jenjang (id, name) VALUES 
('jjg_idadiyah', 'I''dadiyyah'),
('jjg_ibtidaiyyah', 'Ibtida''iyyah'),
('jjg_tsanawiyyah', 'Tsanawiyyah'),
('jjg_aliyyah', 'Aliyyah')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Insert Tingkat for I'dadiyyah (3 Tingkat)
INSERT INTO tingkat (id, jenjang_id, name) VALUES 
('tkt_ida_1', 'jjg_idadiyah', 'I'),
('tkt_ida_2', 'jjg_idadiyah', 'II'),
('tkt_ida_3', 'jjg_idadiyah', 'III')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, jenjang_id = EXCLUDED.jenjang_id;

-- Insert Tingkat for Ibtida'iyyah (6 Tingkat)
INSERT INTO tingkat (id, jenjang_id, name) VALUES 
('tkt_ibt_1', 'jjg_ibtidaiyyah', 'I'),
('tkt_ibt_2', 'jjg_ibtidaiyyah', 'II'),
('tkt_ibt_3', 'jjg_ibtidaiyyah', 'III'),
('tkt_ibt_4', 'jjg_ibtidaiyyah', 'IV'),
('tkt_ibt_5', 'jjg_ibtidaiyyah', 'V'),
('tkt_ibt_6', 'jjg_ibtidaiyyah', 'VI')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, jenjang_id = EXCLUDED.jenjang_id;

-- Insert Tingkat for Tsanawiyyah (3 Tingkat) - 1 is already there but let's ensure it exists
INSERT INTO tingkat (id, jenjang_id, name) VALUES 
('tkt_ts_1', 'jjg_tsanawiyyah', 'I'),
('tkt_ts_2', 'jjg_tsanawiyyah', 'II'),
('tkt_ts_3', 'jjg_tsanawiyyah', 'III')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, jenjang_id = EXCLUDED.jenjang_id;

-- Insert Tingkat for Aliyyah (3 Tingkat)
INSERT INTO tingkat (id, jenjang_id, name) VALUES 
('tkt_aly_1', 'jjg_aliyyah', 'I'),
('tkt_aly_2', 'jjg_aliyyah', 'II'),
('tkt_aly_3', 'jjg_aliyyah', 'III')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, jenjang_id = EXCLUDED.jenjang_id;
