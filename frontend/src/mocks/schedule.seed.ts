/**
 * Official Authentic Schedule Seed Data
 * Source: docs/JADWAL 1 TSN MPHM KWARTAL I.docx
 * Madrasah Tsanawiyah Putri Hidayatul Mubtadi'at Lirboyo Kediri
 * Tahun Ajaran 1447 – 1448 H / 2026 – 2027 M (Kwartal I)
 */

export interface ScheduleItem {
  id: string;
  day: string; // Sabtu, Ahad, Senin, Selasa, Rabu, Kamis
  session: number; // 1 (Hishah 1) or 2 (Hishah 2)
  subjectName: string; // Name of Kitab
  subjectCategory: 'Nahwu' | 'Shorof' | 'Fiqih' | 'Hadits' | 'Akhlaq' | 'Tauhid' | 'Tajwid';
  bagianClass: string; // Bagian A, B, C, D, E, F, G, H, I
  lokalRoom: string; // Lokal 01 - 09
  teacherName: string; // Nama Ustadzah / Pengajar
}

export const LIRBOYO_SCHEDULE_SEED: ScheduleItem[] = [
  // --- BAGIAN A (Lokal 01) ---
  { id: 'sch-a1-s1', day: 'Sabtu', session: 1, subjectName: 'Mukhtashor Jiddan', subjectCategory: 'Nahwu', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a1-s2', day: 'Sabtu', session: 2, subjectName: 'Sullamut Taufiq', subjectCategory: 'Fiqih', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a2-s1', day: 'Ahad', session: 1, subjectName: 'Khoridatul Bahiyyah', subjectCategory: 'Tauhid', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a2-s2', day: 'Ahad', session: 2, subjectName: 'Sullamut Taufiq', subjectCategory: 'Fiqih', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a3-s1', day: 'Senin', session: 1, subjectName: 'Qawaid Shorfiyyah', subjectCategory: 'Shorof', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a3-s2', day: 'Senin', session: 2, subjectName: 'Bulughul Maram', subjectCategory: 'Hadits', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a4-s1', day: 'Selasa', session: 1, subjectName: 'Tasrif Isthilahi', subjectCategory: 'Shorof', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a4-s2', day: 'Selasa', session: 2, subjectName: 'Washoya Al-Abaa\' lil Abnaa\'', subjectCategory: 'Akhlaq', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Ibu Hj. Ummi Sa\'adah Sa\'di' },
  { id: 'sch-a5-s1', day: 'Rabu', session: 1, subjectName: 'Al-I\'lal', subjectCategory: 'Shorof', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a5-s2', day: 'Rabu', session: 2, subjectName: 'Tuhfatul Athfal / Al-Qur\'an', subjectCategory: 'Tajwid', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Ibu Lulu Izzatul Fikriyah' },
  { id: 'sch-a6-s1', day: 'Kamis', session: 1, subjectName: 'Sullamut Taufiq', subjectCategory: 'Fiqih', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Charis Wahyudi' },
  { id: 'sch-a6-s2', day: 'Kamis', session: 2, subjectName: 'Tuhfatul Athfal / Al-Qur\'an', subjectCategory: 'Tajwid', bagianClass: 'Bagian A', lokalRoom: 'Lokal 01', teacherName: 'Ibu Lulu Izzatul Fikriyah' },

  // --- BAGIAN B (Lokal 02) ---
  { id: 'sch-b1-s1', day: 'Sabtu', session: 1, subjectName: 'Mukhtashor Jiddan', subjectCategory: 'Nahwu', bagianClass: 'Bagian B', lokalRoom: 'Lokal 02', teacherName: 'Abdurrahman Addakhel' },
  { id: 'sch-b1-s2', day: 'Sabtu', session: 2, subjectName: 'Bulughul Maram', subjectCategory: 'Hadits', bagianClass: 'Bagian B', lokalRoom: 'Lokal 02', teacherName: 'Abdurrahman Addakhel' },
  { id: 'sch-b2-s1', day: 'Ahad', session: 1, subjectName: 'Khoridatul Bahiyyah', subjectCategory: 'Tauhid', bagianClass: 'Bagian B', lokalRoom: 'Lokal 02', teacherName: 'Abdurrahman Addakhel' },
  { id: 'sch-b2-s2', day: 'Ahad', session: 2, subjectName: 'Sullamut Taufiq', subjectCategory: 'Fiqih', bagianClass: 'Bagian B', lokalRoom: 'Lokal 02', teacherName: 'Abdurrahman Addakhel' },
  { id: 'sch-b3-s1', day: 'Senin', session: 1, subjectName: 'Qawaid Shorfiyyah', subjectCategory: 'Shorof', bagianClass: 'Bagian B', lokalRoom: 'Lokal 02', teacherName: 'Abdurrahman Addakhel' },
  { id: 'sch-b3-s2', day: 'Senin', session: 2, subjectName: 'Washoya Al-Abaa\' lil Abnaa\'', subjectCategory: 'Akhlaq', bagianClass: 'Bagian B', lokalRoom: 'Lokal 02', teacherName: 'Ibu Hj. Ummi Sa\'adah Sa\'di' },

  // --- BAGIAN C (Lokal 03) ---
  { id: 'sch-c1-s1', day: 'Sabtu', session: 1, subjectName: 'Mukhtashor Jiddan', subjectCategory: 'Nahwu', bagianClass: 'Bagian C', lokalRoom: 'Lokal 03', teacherName: 'Ahmad Ilmi Nuroni' },
  { id: 'sch-c1-s2', day: 'Sabtu', session: 2, subjectName: 'Sullamut Taufiq', subjectCategory: 'Fiqih', bagianClass: 'Bagian C', lokalRoom: 'Lokal 03', teacherName: 'Ahmad Ilmi Nuroni' },
  { id: 'sch-c2-s1', day: 'Ahad', session: 1, subjectName: 'Khoridatul Bahiyyah', subjectCategory: 'Tauhid', bagianClass: 'Bagian C', lokalRoom: 'Lokal 03', teacherName: 'Ahmad Ilmi Nuroni' },
  { id: 'sch-c2-s2', day: 'Ahad', session: 2, subjectName: 'Bulughul Maram', subjectCategory: 'Hadits', bagianClass: 'Bagian C', lokalRoom: 'Lokal 03', teacherName: 'Ahmad Ilmi Nuroni' },
  { id: 'sch-c3-s1', day: 'Senin', session: 1, subjectName: 'Qawaid Shorfiyyah', subjectCategory: 'Shorof', bagianClass: 'Bagian C', lokalRoom: 'Lokal 03', teacherName: 'Ahmad Ilmi Nuroni' },
  { id: 'sch-c3-s2', day: 'Senin', session: 2, subjectName: 'Fathul Mubin', subjectCategory: 'Fiqih', bagianClass: 'Bagian C', lokalRoom: 'Lokal 03', teacherName: 'Ibu Siti Sarah Fadilah' },
];

export const TEACHERS_LIST_SEED = [
  { name: 'Ibu Lulu Izzatul Fikriyah', subject: 'Tuhfatul Athfal / Al-Qur\'an', assignedClasses: ['Bagian A', 'Bagian B', 'Bagian C', 'Bagian D'] },
  { name: 'Ibu Siti Khodijah', subject: 'Tuhfatul Athfal / Al-Qur\'an', assignedClasses: ['Bagian E', 'Bagian F', 'Bagian G', 'Bagian H', 'Bagian I'] },
  { name: 'Ibu Hj. Ummi Sa\'adah Sa\'di', subject: 'Washoya Al-Abaa\' lil Abnaa\'', assignedClasses: ['Bagian A', 'Bagian B'] },
  { name: 'Ibu Hj. Nur Fathma', subject: 'Washoya Al-Abaa\' lil Abnaa\'', assignedClasses: ['Bagian C', 'Bagian D', 'Bagian E', 'Bagian F', 'Bagian G'] },
  { name: 'Ibu Aida Masyitoh', subject: 'Washoya Al-Abaa\' lil Abnaa\'', assignedClasses: ['Bagian H', 'Bagian I'] },
  { name: 'Ibu Muyasaroh', subject: 'Fathul Mubin', assignedClasses: ['Bagian A'] },
  { name: 'Ibu Siti Sarah Fadilah', subject: 'Fathul Mubin', assignedClasses: ['Bagian B', 'Bagian C', 'Bagian D', 'Bagian E'] },
  { name: 'Ibu Liyana Ma\'rifatun', subject: 'Fathul Mubin', assignedClasses: ['Bagian F', 'Bagian G', 'Bagian H', 'Bagian I'] },
];
