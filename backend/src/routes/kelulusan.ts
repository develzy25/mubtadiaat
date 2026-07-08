import { Hono } from 'hono';
import { db } from '../db';
import { santri, kelas, kelulusanSertifikat, kelulusanIjazah, tingkat, jenjang } from '../db/schema';
import * as schema from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

const app = new Hono<{ Bindings: CloudflareBindings }>();

// GET /api/kelulusan/sertifikat
// Mengambil data kelulusan sertifikat berdasarkan kelasId dan academicYear
app.get('/sertifikat', async (c) => {
  const kelasId = c.req.query('kelasId');
  const academicYear = c.req.query('academicYear') || '2026-2027';

  if (!kelasId) {
    return c.json({ success: false, message: 'kelasId required' }, 400);
  }

  const d1 = drizzle(c.env.DB, { schema });

  // 1. Dapatkan semua santri di kelas tersebut
  const santriList = await d1.select({
    id: santri.id,
    name: santri.name,
    noStambuk: santri.noStambuk,
    kelasId: santri.kelasId,
  }).from(santri).where(eq(santri.kelasId, kelasId));

  // 2. Dapatkan data kelulusan yang sudah ada
  const kelulusan = await d1.select().from(kelulusanSertifikat)
    .where(and(
      eq(kelulusanSertifikat.kelasId, kelasId),
      eq(kelulusanSertifikat.academicYear, academicYear)
    ));

  // 3. Gabungkan
  const result = santriList.map((s: any) => {
    const k = kelulusan.find((x: any) => x.santriId === s.id);
    return {
      ...s,
      kelulusanId: k?.id || null,
      nilaiUjian: k?.nilaiUjian || null,
      nilaiQiroah: k?.nilaiQiroah || null,
      nilaiMuhafadhoh: k?.nilaiMuhafadhoh || null,
      rataRata: k?.rataRata || null,
      lulus: k?.lulus || false,
      penempatan: k?.penempatan || null,
    };
  });

  return c.json({ success: true, data: result });
});

// GET /api/kelulusan/ijazah
// Mengambil data kelulusan ijazah tingkat akhir
app.get('/ijazah', async (c) => {
  const kelasId = c.req.query('kelasId');
  const academicYear = c.req.query('academicYear') || '2026-2027';

  if (!kelasId) {
    return c.json({ success: false, message: 'kelasId required' }, 400);
  }

  const d1 = drizzle(c.env.DB, { schema });

  const santriList = await d1.select({
    id: santri.id,
    name: santri.name,
    noStambuk: santri.noStambuk,
    kelasId: santri.kelasId,
    tempatLahir: santri.tempatLahir,
    tanggalLahir: santri.tanggalLahir,
  }).from(santri).where(eq(santri.kelasId, kelasId));

  const kelulusan = await d1.select().from(kelulusanIjazah)
    .where(and(
      eq(kelulusanIjazah.kelasId, kelasId),
      eq(kelulusanIjazah.academicYear, academicYear)
    ));

  const result = santriList.map(s => {
    const k = kelulusan.find(x => x.santriId === s.id);
    return {
      ...s,
      kelulusanId: k?.id || null,
      rataRataSmt1: k?.rataRataSmt1 || null,
      rataRataSmt2: k?.rataRataSmt2 || null,
      rataRataAkhir: k?.rataRataAkhir || null,
      lulusPraktik: k?.lulusPraktik || false,
      lulusAlquran: k?.lulusAlquran || false,
      lulusKitab: k?.lulusKitab || false,
      lulusKhidmah: k?.lulusKhidmah || false,
      lulus: k?.lulus || false,
    };
  });

  return c.json({ success: true, data: result });
});

export default app;
