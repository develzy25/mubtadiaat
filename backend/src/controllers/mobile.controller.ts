import { Context } from 'hono';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const getKelasMustahiq = async (c: Context) => {
  // In real implementation, get user ID from token middleware
  const userId = c.get('userId');
  
  // Find asatidz linked to this user
  const asatidzList = await db.select().from(schema.asatidz).where(eq(schema.asatidz.userId, userId));
  if (asatidzList.length === 0) return c.json({ success: true, data: [] });

  const asatidzId = asatidzList[0].id;

  // Find classes where Mustahiq is assigned
  const classList = await db.select().from(schema.kelas).where(eq(schema.kelas.mustahiqId, asatidzId));
  
  return c.json({ success: true, data: classList });
};

export const getJadwalMengajar = async (c: Context) => {
  const userId = c.get('userId');
  
  // Find asatidz linked to this user
  const asatidzList = await db.select().from(schema.asatidz).where(eq(schema.asatidz.userId, userId));
  if (asatidzList.length === 0) return c.json({ success: true, data: [] });

  const asatidzId = asatidzList[0].id;

  // Fetch from jadwal_pelajaran
  const jadwal = await db.select({
    id: schema.jadwalPelajaran.id,
    hari: schema.jadwalPelajaran.hari,
    sesi: schema.jadwalPelajaran.sesi,
    kelas: schema.kelas.bagian,
    kitab: schema.kitab.name,
    tingkat: schema.tingkat.name,
    lokal: schema.kelas.lokal
  })
  .from(schema.jadwalPelajaran)
  .innerJoin(schema.kelas, eq(schema.jadwalPelajaran.kelasId, schema.kelas.id))
  .innerJoin(schema.kitab, eq(schema.jadwalPelajaran.kitabId, schema.kitab.id))
  .innerJoin(schema.tingkat, eq(schema.kelas.tingkatId, schema.tingkat.id))
  .where(eq(schema.jadwalPelajaran.pengajarId, asatidzId));

  // Format into frontend expected structure
  const formattedData = jadwal.map(j => ({
    id: j.id,
    hari: j.hari,
    waktu: j.sesi === 'Sesi 1' ? '07:30 - 08:30' : '08:30 - 09:30',
    kelas: `Kelas ${j.tingkat} - ${j.kelas}`,
    kitab: j.kitab,
    lokal: j.lokal
  }));

  return c.json({ success: true, data: formattedData });
};

export const getPresensiHarian = async (c: Context) => {
  const classId = c.req.param('classId');

  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  const santriList = await db.select().from(schema.santri).where(eq(schema.santri.kelasId, classId));
  
  const data = [];
  for (const s of santriList) {
    const rapot = await db.select().from(schema.rapotSemester)
      .where(and(eq(schema.rapotSemester.santriId, s.id), eq(schema.rapotSemester.kelasId, classId)))
      .limit(1);
    
    data.push({
      id: s.id,
      name: s.name,
      noStambuk: s.noStambuk,
      izin: rapot.length > 0 ? rapot[0].izinCount : 0,
      alpha: rapot.length > 0 ? rapot[0].tanpaIzinCount : 0
    });
  }

  return c.json({ success: true, data });
};

export const savePresensiHarian = async (c: Context) => {
  const classId = c.req.param('classId');
  const body = await c.req.json();
  
  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  let activeYear = '2026-2027';
  const setting = await db.select().from(schema.settings).where(eq(schema.settings.id, 'global')).get();
  if (setting) activeYear = setting.activeAcademicYear;

  for (const s of body) {
    const existing = await db.select().from(schema.rapotSemester)
      .where(and(eq(schema.rapotSemester.santriId, s.santri_id), eq(schema.rapotSemester.kelasId, classId)))
      .limit(1);

    if (existing.length > 0) {
      await db.update(schema.rapotSemester)
        .set({ izinCount: s.izin, tanpaIzinCount: s.alpha, updatedAt: new Date().toISOString() })
        .where(eq(schema.rapotSemester.id, existing[0].id));
    } else {
      await db.insert(schema.rapotSemester).values({
        id: Math.random().toString(36).substring(2, 15), // Basic UID generator
        santriId: s.santri_id,
        kelasId: classId,
        semester: '1',
        academicYear: activeYear,
        izinCount: s.izin,
        tanpaIzinCount: s.alpha,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  return c.json({ success: true, message: 'Rekap Presensi berhasil disimpan' });
};

export const getDashboard = async (c: Context) => {
  const role = c.req.header('X-Role') || 'mustahiq';
  const userId = c.get('userId');
  
  // Real DB count queries
  let summary: any = {};
  let schedule: any[] = [];
  let tasks: any[] = [];

  try {
    if (role === 'mustahiq') {
      const asatidzList = await db.select().from(schema.asatidz).where(eq(schema.asatidz.userId, userId));
      const asatidzId = asatidzList.length > 0 ? asatidzList[0].id : null;
      
      let kelasCount = 0;
      let jadwalCount = 0;
      let penilaianCount = 0;

      if (asatidzId) {
        const kelasCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.kelas).where(eq(schema.kelas.mustahiqId, asatidzId));
        kelasCount = kelasCountResult[0]?.count || 0;
        
        const jadwalCountResult = await db.select({ count: sql<number>`count(*)` }).from(schema.jadwalPelajaran).where(eq(schema.jadwalPelajaran.pengajarId, asatidzId));
        jadwalCount = jadwalCountResult[0]?.count || 0;

        const kelasList = await db.select().from(schema.kelas).where(eq(schema.kelas.mustahiqId, asatidzId));
        if (kelasList.length > 0) {
            const kelasIds = kelasList.map(k => k.id);
            const { inArray } = await import('drizzle-orm');
            const rapotList = await db.select().from(schema.rapotSemester).where(inArray(schema.rapotSemester.kelasId, kelasIds));
            if (rapotList.length > 0) {
               const rapotIds = rapotList.map(r => r.id);
               const penilaianResult = await db.select({ count: sql<number>`count(*)` }).from(schema.rapotNilai).where(inArray(schema.rapotNilai.rapotId, rapotIds));
               penilaianCount = penilaianResult[0]?.count || 0;
            }
        }
      }

      summary = {
        kelas: kelasCount,
        jadwal: jadwalCount,
        tugas: 0, // Tugas not implemented in schema yet
        penilaian: penilaianCount,
      };

      // Fetch actual schedule
      schedule = asatidzId ? await db.select().from(schema.jadwalPelajaran).where(eq(schema.jadwalPelajaran.pengajarId, asatidzId)).limit(5) : [];

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

export const getTugasList = async (c: Context) => {
  // Mock endpoint for Tugas - currently using dummy as table is not defined yet
  return c.json({ success: true, data: [] });
};

export const saveTugas = async (c: Context) => {
  return c.json({ success: true, message: 'Tugas berhasil disimpan' });
};

export const getRekapPresensi = async (c: Context) => {
  try {
    const rapotList = await db.select().from(schema.rapotSemester);
    let totalIzin = 0;
    let totalAlpha = 0;
    let totalHadir = 0;
    
    // In a real scenario, totalHadir is derived from (Total Active Days - (Izin + Alpha)).
    // For this implementation, we will just sum up Izin and Alpha. 
    for (const r of rapotList) {
      totalIzin += r.izinCount || 0;
      totalAlpha += r.tanpaIzinCount || 0;
    }
    
    // Menggunakan standar hari efektif per semester (130 hari)
    const HARI_EFEKTIF_PER_SANTRI = 130; 
    totalHadir = (HARI_EFEKTIF_PER_SANTRI * rapotList.length) - (totalIzin + totalAlpha);

    return c.json({ success: true, data: { 
      totalHadir: totalHadir > 0 ? totalHadir : 0, 
      totalIzin, 
      totalSakit: 0, // Not tracked in current schema 
      totalAlpha 
    } });
  } catch (error) {
    console.error("Error getRekapPresensi:", error);
    return c.json({ success: false, message: 'Failed to fetch rekap presensi' }, 500);
  }
};

// ==========================================
// MODUL PENILAIAN & FINALISASI (BLUEPRINT)
// ==========================================

export const getPenilaianKelas = async (c: Context) => {
  const classId = c.req.query('classId');
  const mapel = c.req.query('mapel');
  const kuartal = c.req.query('kuartal'); // e.g., '1', '2', '3', '4'

  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);
  if (!mapel || !kuartal) return c.json({ success: false, message: 'Mapel and Kuartal required' }, 400);

  try {
    const santriList = await db.select().from(schema.santri).where(eq(schema.santri.kelasId, classId));
    
    const data = [];
    for (const s of santriList) {
      const rapot = await db.select().from(schema.rapotSemester)
        .where(and(eq(schema.rapotSemester.santriId, s.id), eq(schema.rapotSemester.kelasId, classId)))
        .limit(1);

      let nilai = null;
      if (rapot.length > 0) {
         const rn = await db.select().from(schema.rapotNilai)
           .where(and(eq(schema.rapotNilai.rapotId, rapot[0].id), eq(schema.rapotNilai.kitabId, mapel)))
           .limit(1);
         if (rn.length > 0) {
            if (kuartal === '1') nilai = rn[0].kuartal1Score;
            else if (kuartal === '2') nilai = rn[0].kuartal2Score;
            else if (kuartal === '3') nilai = rn[0].kuartal3Score;
            else if (kuartal === '4') nilai = rn[0].kuartal4Score;
         }
      }

      data.push({
        id: s.id,
        name: s.name,
        noStambuk: s.noStambuk,
        nilai: nilai
      });
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error getPenilaianKelas:", error);
    return c.json({ success: false, message: 'Failed to fetch santri list' }, 500);
  }
};

export const savePenilaianKuartal = async (c: Context) => {
  try {
    const body = await c.req.json();
    // body: { classId, mapel, kuartal, scores: [{santri_id, nilai}] }
    
    let activeYear = '2026-2027';
    const setting = await db.select().from(schema.settings).where(eq(schema.settings.id, 'global')).get();
    if (setting) activeYear = setting.activeAcademicYear;

    for (const score of body.scores) {
      let rapot = await db.select().from(schema.rapotSemester)
        .where(and(eq(schema.rapotSemester.santriId, score.santri_id), eq(schema.rapotSemester.kelasId, body.classId)))
        .limit(1);
      
      let rapotId;
      if (rapot.length === 0) {
        rapotId = Math.random().toString(36).substring(2, 15);
        await db.insert(schema.rapotSemester).values({
          id: rapotId,
          santriId: score.santri_id,
          kelasId: body.classId,
          semester: '1',
          academicYear: activeYear,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        rapotId = rapot[0].id;
      }

      const kitabId = body.mapelId; 

      let rn = await db.select().from(schema.rapotNilai)
        .where(and(eq(schema.rapotNilai.rapotId, rapotId), eq(schema.rapotNilai.kitabId, kitabId)))
        .limit(1);

      const updateData: any = { updatedAt: new Date().toISOString() };
      if (body.kuartal === 1) updateData.kuartal1Score = score.nilai;
      else if (body.kuartal === 2) updateData.kuartal2Score = score.nilai;
      else if (body.kuartal === 3) updateData.kuartal3Score = score.nilai;
      else if (body.kuartal === 4) updateData.kuartal4Score = score.nilai;

      if (rn.length === 0) {
        await db.insert(schema.rapotNilai).values({
          id: Math.random().toString(36).substring(2, 15),
          rapotId: rapotId,
          kitabId: kitabId,
          ...updateData,
          createdAt: new Date().toISOString(),
        });
      } else {
        await db.update(schema.rapotNilai)
          .set(updateData)
          .where(eq(schema.rapotNilai.id, rn[0].id));
      }
    }

    return c.json({ success: true, message: 'Nilai berhasil disimpan' });
  } catch (error) {
    console.error("Error savePenilaianKuartal:", error);
    return c.json({ success: false, message: 'Failed to save nilai' }, 500);
  }
};

export const getStatusKelas = async (c: Context) => {
  try {
    const classList = await db.select().from(schema.kelas).limit(5);
    
    const data = [];
    for (const k of classList) {
      // Find total santri
      const santriList = await db.select().from(schema.santri).where(eq(schema.santri.kelasId, k.id));
      const totalSantri = santriList.length;

      // Find finalization status from rapotSemester
      let status = 'Draft';
      let progress = 0;
      
      if (totalSantri > 0) {
        const rapot = await db.select().from(schema.rapotSemester).where(eq(schema.rapotSemester.kelasId, k.id));
        const totalRapot = rapot.length;
        const finalized = rapot.filter(r => r.isFinalized).length;
        
        progress = Math.floor((totalRapot / totalSantri) * 100);
        if (progress === 100 && finalized === totalSantri) {
          status = 'SUDAH FINAL';
        } else if (progress === 100) {
          status = 'Siap Finalisasi';
        }
      }

      let waliName = 'Belum Ditentukan';
      if (k.mustahiqId) {
         const mustahiq = await db.select().from(schema.asatidz).where(eq(schema.asatidz.id, k.mustahiqId)).limit(1);
         if (mustahiq.length > 0) {
            waliName = mustahiq[0].name;
         }
      }

      data.push({
        id: k.id,
        name: `Kelas ${k.bagian}`,
        wali: waliName, 
        totalSantri,
        progress,
        status
      });
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error getStatusKelas:", error);
    return c.json({ success: false, message: 'Failed to fetch status kelas' }, 500);
  }
};

export const finalisasiKelas = async (c: Context) => {
  const classId = c.req.param('classId');
  
  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  try {
    const rapotList = await db.select().from(schema.rapotSemester).where(eq(schema.rapotSemester.kelasId, classId));
    
    for (const rapot of rapotList) {
       const rnList = await db.select().from(schema.rapotNilai).where(eq(schema.rapotNilai.rapotId, rapot.id));
       
       for (const rn of rnList) {
         // Calculate Khosh and Am according to Blueprint logic
         const sum = (rn.kuartal1Score || 0) + (rn.kuartal2Score || 0) + (rn.kuartal3Score || 0) + (rn.kuartal4Score || 0);
         const count = [rn.kuartal1Score, rn.kuartal2Score, rn.kuartal3Score, rn.kuartal4Score].filter(x => x !== null && x !== undefined).length;
         
         const amScore = count > 0 ? Number((sum / count).toFixed(2)) : 0;
         const khoshScore = rn.kuartal4Score || 0;

         await db.update(schema.rapotNilai)
           .set({ amScore, khoshScore, updatedAt: new Date().toISOString() })
           .where(eq(schema.rapotNilai.id, rn.id));
       }

       await db.update(schema.rapotSemester)
         .set({ isFinalized: true, updatedAt: new Date().toISOString() })
         .where(eq(schema.rapotSemester.id, rapot.id));
    }
    
    return c.json({ success: true, message: 'Kelas berhasil difinalisasi' });
  } catch (error) {
    console.error("Error finalisasiKelas:", error);
    return c.json({ success: false, message: 'Failed to finalize class' }, 500);
  }
};
