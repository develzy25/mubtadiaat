import { db } from './index';
import * as schema from './schema';

async function seedTsanawiyah() {
  console.log('Seeding Tsanawiyah Data...');

  // 1. Insert Asatidz (Mustahiq)
  const mustahiqData = [
    { id: 'ast_charis', name: 'Bpk. Charis Wahyudi', status: 'ACTIVE' },
    { id: 'ast_abdurrahman', name: 'Bpk. Abdurrahman Addakhel', status: 'ACTIVE' },
    { id: 'ast_ahmad_ilmi', name: 'Bpk. Ahmad Ilmi Nuroni', status: 'ACTIVE' },
    { id: 'ast_aji', name: 'Bpk. Aji Prio Pangestu', status: 'ACTIVE' },
    { id: 'ast_shoddiq', name: 'Bpk. Muhammad Shoddiq Asyhari', status: 'ACTIVE' },
    { id: 'ast_salman', name: 'Bpk. Salman Al Farisy', status: 'ACTIVE' },
    { id: 'ast_alex', name: 'Bpk. Alex Rizquna', status: 'ACTIVE' },
    { id: 'ast_zidna', name: 'Bpk. Zidna Farhan Biknada', status: 'ACTIVE' },
    { id: 'ast_ali', name: 'Bpk. Ali Ya\'lu', status: 'ACTIVE' },
  ];
  await db.insert(schema.asatidz).values(mustahiqData).onConflictDoNothing();

  // 2. Insert Asatidz (Munawwibah)
  const munawwibahData = [
    { id: 'ast_lulu', name: 'Ibu Lulu Izzatul Fikriyah', status: 'ACTIVE' },
    { id: 'ast_siti_khodijah', name: 'Ibu Siti Khodijah', status: 'ACTIVE' },
    { id: 'ast_ummi_saadah', name: 'Ibu Hj. Ummi Sa\'adah Sa\'di', status: 'ACTIVE' },
    { id: 'ast_nur_fathma', name: 'Ibu Hj. Nur Fathma', status: 'ACTIVE' },
    { id: 'ast_aida', name: 'Ibu Aida Masyitoh', status: 'ACTIVE' },
    { id: 'ast_muyasaroh', name: 'Ibu Muyasaroh', status: 'ACTIVE' },
    { id: 'ast_siti_sarah', name: 'Ibu Siti Sarah Fadilah', status: 'ACTIVE' },
    { id: 'ast_liyana', name: 'Ibu Liyana Ma\'rifatun', status: 'ACTIVE' },
  ];
  await db.insert(schema.asatidz).values(munawwibahData).onConflictDoNothing();

  // 3. Insert Jenjang & Tingkat
  await db.insert(schema.jenjang).values([{ id: 'jjg_tsanawiyah', name: 'Tsanawiyah' }]).onConflictDoNothing();
  await db.insert(schema.tingkat).values([{ id: 'tkt_ts_1', jenjangId: 'jjg_tsanawiyah', name: 'I' }]).onConflictDoNothing();

  // 4. Insert Kelas (Bagian & Lokal)
  const kelasData = [
    { id: 'kls_ts1_a', tingkatId: 'tkt_ts_1', bagian: 'A', lokal: 'Lokal 01', mustahiqId: 'ast_charis' },
    { id: 'kls_ts1_b', tingkatId: 'tkt_ts_1', bagian: 'B', lokal: 'Lokal 02', mustahiqId: 'ast_abdurrahman' },
    { id: 'kls_ts1_c', tingkatId: 'tkt_ts_1', bagian: 'C', lokal: 'Lokal 03', mustahiqId: 'ast_ahmad_ilmi' },
    { id: 'kls_ts1_d', tingkatId: 'tkt_ts_1', bagian: 'D', lokal: 'Lokal 04', mustahiqId: 'ast_aji' },
    { id: 'kls_ts1_e', tingkatId: 'tkt_ts_1', bagian: 'E', lokal: 'Lokal 05', mustahiqId: 'ast_shoddiq' },
    { id: 'kls_ts1_f', tingkatId: 'tkt_ts_1', bagian: 'F', lokal: 'Lokal 06', mustahiqId: 'ast_salman' },
    { id: 'kls_ts1_g', tingkatId: 'tkt_ts_1', bagian: 'G', lokal: 'Lokal 07', mustahiqId: 'ast_alex' },
    { id: 'kls_ts1_h', tingkatId: 'tkt_ts_1', bagian: 'H', lokal: 'Lokal 08', mustahiqId: 'ast_zidna' },
    { id: 'kls_ts1_i', tingkatId: 'tkt_ts_1', bagian: 'I', lokal: 'Lokal 09', mustahiqId: 'ast_ali' },
  ];
  await db.insert(schema.kelas).values(kelasData).onConflictDoNothing();

  // 5. Insert Kitab/Pelajaran
  const kitabData = [
    { id: 'ktb_mukhtashor', tingkatId: 'tkt_ts_1', name: 'Mukhtashor Jiddan' },
    { id: 'ktb_fathul', tingkatId: 'tkt_ts_1', name: 'Fathul Mubin' },
    { id: 'ktb_khoridah', tingkatId: 'tkt_ts_1', name: 'Al-Khoridah Al-Bahiyyah / Mukhtashor Jiddan' },
    { id: 'ktb_sullam', tingkatId: 'tkt_ts_1', name: 'Sullam Taufiq' },
    { id: 'ktb_qowaid', tingkatId: 'tkt_ts_1', name: 'Qowa\'id As-Shorfiyyah' },
    { id: 'ktb_bulughul', tingkatId: 'tkt_ts_1', name: 'Bulughul Marom' },
    { id: 'ktb_tashrif', tingkatId: 'tkt_ts_1', name: 'Tashrif Al-Ishthilahi' },
    { id: 'ktb_washoya', tingkatId: 'tkt_ts_1', name: 'Washoya Al-Abaa\' lil Abnaa\'' },
    { id: 'ktb_ilal', tingkatId: 'tkt_ts_1', name: 'Al-I\'lal' },
    { id: 'ktb_tuhfah', tingkatId: 'tkt_ts_1', name: 'Tuhfah al-Athfal / Al-Qur\'an' },
  ];
  await db.insert(schema.kitab).values(kitabData).onConflictDoNothing();

  // 6. Insert Jadwal Pelajaran
  // Berdasarkan gambar jadwal (semua kelas jadwalnya persis sama urutannya untuk kelas 1 Tsanawiyah)
  // Kecuali untuk pelajaran yang diampu Munawwibah (Tuhfah, Washoya, Fathul Mubin) akan kita beri id pengajarnya.
  
  const days = ['Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis'];
  
  // Mapping jadwal harian (berlaku untuk semua bagian)
  // [Sesi 1, Sesi 2]
  const jadwalTemplate = {
    'Sabtu': ['ktb_mukhtashor', 'ktb_fathul'],
    'Ahad': ['ktb_khoridah', 'ktb_sullam'],
    'Senin': ['ktb_qowaid', 'ktb_bulughul'],
    'Selasa': ['ktb_tashrif', 'ktb_washoya'],
    'Rabu': ['ktb_ilal', 'ktb_bulughul'],
    'Kamis': ['ktb_sullam', 'ktb_tuhfah']
  };

  const jadwalInserts: any[] = [];

  for (const kls of kelasData) {
    const bagian = kls.bagian;
    
    // Tentukan Munawwibah berdasarkan bagian
    // Tuhfah al-Athfal (A B C D = ast_lulu, E F G H I = ast_siti_khodijah)
    const guruTuhfah = ['A','B','C','D'].includes(bagian) ? 'ast_lulu' : 'ast_siti_khodijah';
    
    // Washoya (A B = ast_ummi_saadah, C D E F G = ast_nur_fathma, H I = ast_aida)
    let guruWashoya = 'ast_aida';
    if (['A','B'].includes(bagian)) guruWashoya = 'ast_ummi_saadah';
    else if (['C','D','E','F','G'].includes(bagian)) guruWashoya = 'ast_nur_fathma';

    // Fathul Mubin (A = ast_muyasaroh, B C D E = ast_siti_sarah, F G H I = ast_liyana)
    let guruFathul = 'ast_liyana';
    if (bagian === 'A') guruFathul = 'ast_muyasaroh';
    else if (['B','C','D','E'].includes(bagian)) guruFathul = 'ast_siti_sarah';

    for (const [hari, kitabs] of Object.entries(jadwalTemplate)) {
      for (let sesi = 0; sesi < 2; sesi++) {
        const kitabId = kitabs[sesi];
        
        let pengajarId = kls.mustahiqId; // Default pengajar adalah wali kelas (Mustahiq)
        if (kitabId === 'ktb_tuhfah') pengajarId = guruTuhfah;
        if (kitabId === 'ktb_washoya') pengajarId = guruWashoya;
        if (kitabId === 'ktb_fathul') pengajarId = guruFathul;

        jadwalInserts.push({
          id: `jdw_${kls.id}_${hari}_${sesi+1}`,
          kelasId: kls.id,
          kitabId: kitabId,
          hari: hari,
          sesi: `Sesi ${sesi+1}`,
          pengajarId: pengajarId,
          academicYear: '2025-2026'
        });
      }
    }
  }

  await db.insert(schema.jadwalPelajaran).values(jadwalInserts).onConflictDoNothing();
  console.log('Seeding Success!');
}

seedTsanawiyah().catch(console.error);
