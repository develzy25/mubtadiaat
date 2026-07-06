const API_URL = 'https://mubtadiat-db.eppds.workers.dev/api/admin';

async function seed() {
  console.log('Seeding Blok...');
  const bloks = [
    { id: 'blk_1', name: 'Blok A (Utama)' },
    { id: 'blk_2', name: 'Blok B (Barat)' },
  ];
  for (const b of bloks) {
    await fetch(`${API_URL}/infrastruktur/blok`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b)
    });
  }

  console.log('Seeding Kamar...');
  const kamars = [
    { id: 'kmr_1', name: 'Kamar A.01', blokId: 'blk_1', penasihatId: 'ast_charis' },
    { id: 'kmr_2', name: 'Kamar A.02', blokId: 'blk_1', penasihatId: 'ast_abdurrahman' },
    { id: 'kmr_3', name: 'Kamar B.01', blokId: 'blk_2', penasihatId: 'ast_ahmad_ilmi' },
  ];
  for (const k of kamars) {
    await fetch(`${API_URL}/infrastruktur/kamar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(k)
    });
  }

  console.log('Seeding Santri...');
  const santris = [
    { id: 'str_1', noStambuk: '20250001', nik: '3512340001', name: 'Aisyah Putri', alamatLengkap: 'Kudus', kelasId: 'kls_ts1_a', kamarId: 'kmr_1', status: 'ACTIVE' },
    { id: 'str_2', noStambuk: '20250002', nik: '3512340002', name: 'Siti Fatimah', alamatLengkap: 'Demak', kelasId: 'kls_ts1_a', kamarId: 'kmr_1', status: 'ACTIVE' },
    { id: 'str_3', noStambuk: '20250003', nik: '3512340003', name: 'Nurul Huda', alamatLengkap: 'Pati', kelasId: 'kls_ts1_b', kamarId: 'kmr_2', status: 'ACTIVE' },
    { id: 'str_4', noStambuk: '20250004', nik: '3512340004', name: 'Nabila Khoirunnisa', alamatLengkap: 'Semarang', kelasId: 'kls_ts1_c', kamarId: 'kmr_3', status: 'ACTIVE' },
    { id: 'str_5', noStambuk: '20250005', nik: '3512340005', name: 'Rina Wati', alamatLengkap: 'Jepara', kelasId: 'kls_ts1_d', kamarId: 'kmr_2', status: 'CUTI' },
    { id: 'str_6', noStambuk: '20250006', nik: '3512340006', name: 'Laila Lathifa', alamatLengkap: 'Grobogan', kelasId: 'kls_ts1_e', kamarId: 'kmr_3', status: 'BOYONG', tahunKeluar: '2024' },
    { id: 'str_7', noStambuk: '20250007', nik: '3512340007', name: 'Zahra Ramadhani', alamatLengkap: 'Kendal', kelasId: 'kls_ts1_a', kamarId: 'kmr_1', status: 'ACTIVE' },
    { id: 'str_8', noStambuk: '20250008', nik: '3512340008', name: 'Putri Salsabila', alamatLengkap: 'Rembang', kelasId: 'kls_ts1_b', kamarId: 'kmr_2', status: 'ACTIVE' },
  ];
  for (const s of santris) {
    await fetch(`${API_URL}/santri`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
  }

  console.log('Seeding via API Success!');
}

seed().catch(console.error);
