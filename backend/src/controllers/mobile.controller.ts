import { Context } from 'hono';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const getKelasMustahiq = async (c: Context) => {
  // In real implementation, get user ID from token middleware
  const userId = c.get('userId') || 'simulated-user-id';
  
  // Find asatidz linked to this user
  const asatidzList = await db.select().from(schema.asatidz).where(eq(schema.asatidz.userId, userId));
  if (asatidzList.length === 0) return c.json({ success: true, data: [] });

  const asatidzId = asatidzList[0].id;

  // Find classes where Mustahiq is assigned
  const classList = await db.select().from(schema.kelas).where(eq(schema.kelas.mustahiqId, asatidzId));
  
  return c.json({ success: true, data: classList });
};

export const getJadwalMengajar = async (c: Context) => {
  const userId = c.get('userId') || 'simulated-user-id';
  // Simplified for now
  return c.json({ success: true, data: [] });
};

export const getPresensiHarian = async (c: Context) => {
  const classId = c.req.param('classId');
  const month = c.req.query('month') || new Date().toISOString().substring(0, 7); // YYYY-MM

  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  const santriList = await db.select().from(schema.santri).where(eq(schema.santri.kelasId, classId));
  
  // Simplified response to provide list of students to mark attendance
  const data = santriList.map(s => ({
    id: s.id,
    name: s.name,
    noStambuk: s.noStambuk,
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpha: 0
  }));

  return c.json({ success: true, data });
};

export const savePresensiHarian = async (c: Context) => {
  const classId = c.req.param('classId');
  const body = await c.req.json();
  
  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  // In real implementation, save to schema.attendance and schema.attendanceDetails
  
  return c.json({ success: true, message: 'Presensi berhasil disimpan' });
};

export const getDashboard = async (c: Context) => {
  const role = c.req.header('X-Role') || 'mustahiq';
  const userId = c.get('userId') || 'simulated-user-id';
  
  // Real DB count queries
  let summary: any = {};
  let schedule: any[] = [];
  let tasks: any[] = [];

  try {
    if (role === 'mustahiq') {
      const kelasCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.kelas).where(eq(schema.kelas.mustahiqId, userId));
      const kelasCount = kelasCountResult[0]?.count || 0;
      
      const jadwalCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.jadwalPelajaran).where(eq(schema.jadwalPelajaran.pengajarId, userId));
      const jadwalCount = jadwalCountResult[0]?.count || 0;

      summary = {
        kelas: kelasCount,
        jadwal: jadwalCount,
        tugas: 0, // Tugas not implemented in schema yet
        penilaian: 0, // Penilaian needs specific queries
      };

      // Fetch actual schedule
      schedule = await db.select().from(schema.jadwalPelajaran).where(eq(schema.jadwalPelajaran.pengajarId, userId)).limit(5);

    } else if (role === 'mufatish') {
      const asatidzList = await db.select().from(schema.asatidz).where(eq(schema.asatidz.userId, userId));
      summary = { totalKelas: 0, totalSantri: 0, guruAktif: 0, laporan: 0 };
      
      if (asatidzList.length > 0) {
        const asatidzId = asatidzList[0].id;
        const jenjangList = await db.select().from(schema.jenjang).where(eq(schema.jenjang.mufatishId, asatidzId));
        
        if (jenjangList.length > 0) {
          const jenjangId = jenjangList[0].id;
          const tingkatList = await db.select().from(schema.tingkat).where(eq(schema.tingkat.jenjangId, jenjangId));
          const tingkatIds = tingkatList.map(t => t.id);
          
          if (tingkatIds.length > 0) {
            const { inArray } = await import('drizzle-orm');
            const kelasCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.kelas).where(inArray(schema.kelas.tingkatId, tingkatIds));
            const kelasList = await db.select().from(schema.kelas).where(inArray(schema.kelas.tingkatId, tingkatIds));
            const kelasIds = kelasList.map(k => k.id);
            
            let santriCount = 0;
            if (kelasIds.length > 0) {
               const santriCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.santri).where(inArray(schema.santri.kelasId, kelasIds));
               santriCount = santriCountResult[0]?.count || 0;
            }

            summary = {
              totalKelas: kelasCountResult[0]?.count || 0,
              totalSantri: santriCount,
              guruAktif: 0,
              laporan: 0,
            };
          }
        }
      }
    } else if (role === 'mundzir') {
      const totalKelasResult = await db.select({ count: sql<number>`count(*)` }).from(schema.kelas);
      const totalSantriResult = await db.select({ count: sql<number>`count(*)` }).from(schema.santri);
      
      summary = {
        totalKelas: totalKelasResult[0]?.count || 0,
        totalSantri: totalSantriResult[0]?.count || 0,
        guruAktif: 0,
        laporan: 0,
      };
    }

    return c.json({ success: true, data: { summary, schedule, tasks, role } });
  } catch (error) {
    console.error("Dashboard error:", error);
    return c.json({ success: false, message: 'Failed to fetch dashboard' }, 500);
  }
};
