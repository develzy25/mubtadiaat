/**
 * Authentic Santri Putri Seed Data
 * Madrasah Tsanawiyah Putri Hidayatul Mubtadi'at Lirboyo Kediri
 */

export interface Santri {
  id: string;
  nisn: string;
  namaLengkap: string;
  bagianClass: string; // Bagian A, B, C, D, E, F, G, H, I
  lokalRoom: string; // Lokal 01 - 09
  asramaKamar: string; // Misal: Asrama Al-Baqarah 03
  statusAktif: boolean;
  presensiHariIni?: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA';
  setoranNadzomTerakhir?: {
    kitabNadzom: string;
    baitCompleted: number;
    totalTargetBait: number;
    lastDate: string;
  };
}

export const SANTRI_LIRBOYO_SEED: Santri[] = [
  // --- BAGIAN A (Lokal 01) ---
  {
    id: 'str-001',
    nisn: '317401928301',
    namaLengkap: 'Aisyah Humaira',
    bagianClass: 'Bagian A',
    lokalRoom: 'Lokal 01',
    asramaKamar: 'Kamar Khadijah 01',
    statusAktif: true,
    presensiHariIni: 'HADIR',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Nadzom Alfiyah Ibnu Malik',
      baitCompleted: 125,
      totalTargetBait: 1000,
      lastDate: '2026-07-01',
    },
  },
  {
    id: 'str-002',
    nisn: '317401928302',
    namaLengkap: 'Fatimah Az-Zahra',
    bagianClass: 'Bagian A',
    lokalRoom: 'Lokal 01',
    asramaKamar: 'Kamar Khadijah 01',
    statusAktif: true,
    presensiHariIni: 'HADIR',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Nadzom Imrithi',
      baitCompleted: 85,
      totalTargetBait: 254,
      lastDate: '2026-07-02',
    },
  },
  {
    id: 'str-003',
    nisn: '317401928303',
    namaLengkap: 'Zahra Nabila',
    bagianClass: 'Bagian A',
    lokalRoom: 'Lokal 01',
    asramaKamar: 'Kamar Khadijah 02',
    statusAktif: true,
    presensiHariIni: 'IZIN',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Tuhfatul Athfal',
      baitCompleted: 61,
      totalTargetBait: 61,
      lastDate: '2026-06-30',
    },
  },
  {
    id: 'str-004',
    nisn: '317401928304',
    namaLengkap: 'Nabilah Wardah',
    bagianClass: 'Bagian A',
    lokalRoom: 'Lokal 01',
    asramaKamar: 'Kamar Khadijah 02',
    statusAktif: true,
    presensiHariIni: 'HADIR',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Aqidatul Awam',
      baitCompleted: 57,
      totalTargetBait: 57,
      lastDate: '2026-06-29',
    },
  },
  {
    id: 'str-005',
    nisn: '317401928305',
    namaLengkap: 'Syifa Fauziyah',
    bagianClass: 'Bagian A',
    lokalRoom: 'Lokal 01',
    asramaKamar: 'Kamar Khadijah 03',
    statusAktif: true,
    presensiHariIni: 'SAKIT',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Nadzom Alfiyah Ibnu Malik',
      baitCompleted: 90,
      totalTargetBait: 1000,
      lastDate: '2026-06-28',
    },
  },

  // --- BAGIAN B (Lokal 02) ---
  {
    id: 'str-006',
    nisn: '317401928306',
    namaLengkap: 'Maryam Maryana',
    bagianClass: 'Bagian B',
    lokalRoom: 'Lokal 02',
    asramaKamar: 'Kamar Aisyah 01',
    statusAktif: true,
    presensiHariIni: 'HADIR',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Nadzom Imrithi',
      baitCompleted: 110,
      totalTargetBait: 254,
      lastDate: '2026-07-01',
    },
  },
  {
    id: 'str-007',
    nisn: '317401928307',
    namaLengkap: 'Khadijah Al-Qubra',
    bagianClass: 'Bagian B',
    lokalRoom: 'Lokal 02',
    asramaKamar: 'Kamar Aisyah 02',
    statusAktif: true,
    presensiHariIni: 'HADIR',
    setoranNadzomTerakhir: {
      kitabNadzom: 'Nadzom Alfiyah Ibnu Malik',
      baitCompleted: 210,
      totalTargetBait: 1000,
      lastDate: '2026-07-02',
    },
  },
];
