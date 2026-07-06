import { Context } from 'hono';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export const getRapotGrid = async (c: Context) => {
  const classId = c.req.param('classId');
  const semester = c.req.query('semester') || '1';
  const year = c.req.query('year') || '2026-2027';

  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  // Get all santri in this class
  const santriList = await db.select().from(schema.santri).where(eq(schema.santri.kelasId, classId));
  
  if (santriList.length === 0) {
    return c.json({ success: true, data: [] });
  }

  const santriIds = santriList.map(s => s.id);

  // Get rapot semester data
  const rapotData = await db.select().from(schema.rapotSemester).where(
    and(
      inArray(schema.rapotSemester.santriId, santriIds),
      eq(schema.rapotSemester.semester, semester),
      eq(schema.rapotSemester.academicYear, year)
    )
  );

  const rapotIds = rapotData.map(r => r.id);

  // Get rapot nilai
  let nilaiData: any[] = [];
  if (rapotIds.length > 0) {
    nilaiData = await db.select({
      id: schema.rapotNilai.id,
      rapotId: schema.rapotNilai.rapotId,
      kitabId: schema.rapotNilai.kitabId,
      kuartal1Score: schema.rapotNilai.kuartal1Score,
      kuartal2Score: schema.rapotNilai.kuartal2Score,
      khoshScore: schema.rapotNilai.khoshScore,
      kitabName: schema.kitab.name,
    })
    .from(schema.rapotNilai)
    .leftJoin(schema.kitab, eq(schema.rapotNilai.kitabId, schema.kitab.id))
    .where(inArray(schema.rapotNilai.rapotId, rapotIds));
  }

  // Aggregate into grid format
  const grid = santriList.map(santri => {
    const rapot = rapotData.find(r => r.santriId === santri.id);
    const nilai = rapot ? nilaiData.filter(n => n.rapotId === rapot.id) : [];
    
    return {
      student: {
        id: santri.id,
        name: santri.name,
        noStambuk: santri.noStambuk
      },
      rapotId: rapot?.id || null,
      izinCount: rapot?.izinCount || 0,
      tanpaIzinCount: rapot?.tanpaIzinCount || 0,
      nilaiAkhlaq: rapot?.nilaiAkhlaq || 8,
      predikatOverride: rapot?.nilaiPrestasi || null,
      isFinalized: rapot?.isFinalized || false,
      catatan: rapot?.catatan || '',
      scores: nilai.map(n => ({
        kitabId: n.kitabId,
        kitabName: n.kitabName,
        tamrinScore: n.kuartal1Score || 0,
        ujianScore: n.kuartal2Score || 0,
        khoshScore: n.khoshScore || 0
      }))
    };
  });

  return c.json({ success: true, data: grid });
};

export const saveRapotBatch = async (c: Context) => {
  const body = await c.req.json();
  const { classId, semester, academicYear, data } = body;

  if (!classId || !data || !Array.isArray(data)) {
    return c.json({ success: false, message: 'Invalid payload' }, 400);
  }

  for (const item of data) {
    let rapotId = item.rapotId;
    
    if (!rapotId) {
      // Create new rapot semester
      rapotId = 'rpt_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      await db.insert(schema.rapotSemester).values({
        id: rapotId,
        santriId: item.santriId,
        kelasId: classId,
        semester,
        academicYear,
        izinCount: item.izinCount || 0,
        tanpaIzinCount: item.tanpaIzinCount || 0,
        nilaiAkhlaq: item.nilaiAkhlaq || 8,
        nilaiPrestasi: item.predikatOverride || null,
        catatan: item.catatan || '',
        isFinalized: false,
      }).run();
    } else {
      // Update existing
      await db.update(schema.rapotSemester).set({
        izinCount: item.izinCount || 0,
        tanpaIzinCount: item.tanpaIzinCount || 0,
        nilaiAkhlaq: item.nilaiAkhlaq || 8,
        nilaiPrestasi: item.predikatOverride || null,
        catatan: item.catatan || '',
      }).where(eq(schema.rapotSemester.id, rapotId)).run();
    }

    // Save Nilai Array
    if (item.scores && Array.isArray(item.scores)) {
      // Clear existing nilai for this rapot to simplify update
      await db.delete(schema.rapotNilai).where(eq(schema.rapotNilai.rapotId, rapotId)).run();
      
      const payloadNilai = item.scores.map((n: any) => {
        let tamrin = n.tamrinScore || 0;
        let ujian = n.ujianScore || 0;
        let khosh = (tamrin + ujian) / 2;
        
        // Pembulatan Khosh (>= 0.5 ke atas, < 0.5 ke bawah)
        khosh = Math.round(khosh);
        
        // Batasi 4 - 9 (kecuali kalau memang 0 karena belum diisi)
        if (khosh > 0) {
            if (khosh < 4) khosh = 4;
            if (khosh > 9) khosh = 9;
        }

        return {
          id: 'rpn_' + Date.now() + '_' + Math.random().toString(36).substring(7),
          rapotId: rapotId,
          kitabId: n.kitabId,
          kuartal1Score: tamrin,
          kuartal2Score: ujian,
          khoshScore: khosh,
        };
      });

      if (payloadNilai.length > 0) {
        await db.insert(schema.rapotNilai).values(payloadNilai).run();
      }
    }
  }

  return c.json({ success: true, message: 'Rapot saved successfully' });
};

export const fetchNilaiAm = async (c: Context) => {
  const classId = c.req.param('classId');
  const semester = c.req.query('semester') || '1';
  const year = c.req.query('year') || '2026-2027';

  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  // Get all rapot ids for this class
  const rapotData = await db.select().from(schema.rapotSemester).where(
    and(
      eq(schema.rapotSemester.kelasId, classId),
      eq(schema.rapotSemester.semester, semester),
      eq(schema.rapotSemester.academicYear, year)
    )
  );
  
  if (rapotData.length === 0) return c.json({ success: true, data: [] });
  const rapotIds = rapotData.map(r => r.id);

  // Group by kitab and calculate average khoshScore
  const nilaiData = await db.select({
    kitabId: schema.rapotNilai.kitabId,
    kitabName: schema.kitab.name,
    // Calculate sum and count manually if AVG is tricky, or just get all and reduce in memory
    khoshScore: schema.rapotNilai.khoshScore
  })
  .from(schema.rapotNilai)
  .leftJoin(schema.kitab, eq(schema.rapotNilai.kitabId, schema.kitab.id))
  .where(inArray(schema.rapotNilai.rapotId, rapotIds));

  const amMap: Record<string, { sum: number, count: number, name: string }> = {};
  nilaiData.forEach(n => {
    if (n.kitabId && n.khoshScore) {
      if (!amMap[n.kitabId]) amMap[n.kitabId] = { sum: 0, count: 0, name: n.kitabName || '' };
      // Empty score is considered 4 as per rules
      const val = n.khoshScore > 0 ? n.khoshScore : 4;
      amMap[n.kitabId].sum += val;
      amMap[n.kitabId].count++;
    }
  });

  const result = Object.values(amMap).map(v => ({
    kitabName: v.name,
    nilaiAm: Math.round(v.sum / rapotData.length) // Divided by total students in class (even if didn't take exam)
  }));

  return c.json({ success: true, data: result });
};

export const fetchRekap = async (c: Context) => {
  const santriId = c.req.param('santriId');
  const year = c.req.query('year') || '2026-2027';

  if (!santriId) return c.json({ success: false, message: 'Santri ID required' }, 400);

  // Get rapot semester 1 & 2 for this student
  const rapotData = await db.select().from(schema.rapotSemester).where(
    and(
      eq(schema.rapotSemester.santriId, santriId),
      eq(schema.rapotSemester.academicYear, year)
    )
  );

  const rptS1 = rapotData.find(r => r.semester === 'I');
  const rptS2 = rapotData.find(r => r.semester === 'II');

  let s1Nilai: any[] = [];
  let s2Nilai: any[] = [];

  if (rptS1) {
    s1Nilai = await db.select({
      kitabName: schema.kitab.name,
      khoshScore: schema.rapotNilai.khoshScore
    })
    .from(schema.rapotNilai)
    .leftJoin(schema.kitab, eq(schema.rapotNilai.kitabId, schema.kitab.id))
    .where(eq(schema.rapotNilai.rapotId, rptS1.id));
  }

  if (rptS2) {
    s2Nilai = await db.select({
      kitabName: schema.kitab.name,
      khoshScore: schema.rapotNilai.khoshScore
    })
    .from(schema.rapotNilai)
    .leftJoin(schema.kitab, eq(schema.rapotNilai.kitabId, schema.kitab.id))
    .where(eq(schema.rapotNilai.rapotId, rptS2.id));
  }

  // Combine unique mapels
  const mapelSet = new Set([...s1Nilai.map(n => n.kitabName), ...s2Nilai.map(n => n.kitabName)].filter(Boolean));
  const detailMapel = Array.from(mapelSet).map(kitabName => {
    const s1 = s1Nilai.find(n => n.kitabName === kitabName)?.khoshScore || 0;
    const s2 = s2Nilai.find(n => n.kitabName === kitabName)?.khoshScore || 0;
    return {
      kitabName,
      s1Khos: s1,
      s2Khos: s2
    };
  });

  return c.json({ 
    success: true, 
    data: { 
      s1: rptS1 ? true : false,
      s2: rptS2 ? true : false,
      detailMapel
    } 
  });
};

export const finalizeKelas = async (c: Context) => {
  const body = await c.req.json();
  const { classId, semester, academicYear } = body;
  
  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  // Set all rapot for this class to finalized
  await db.update(schema.rapotSemester)
    .set({ isFinalized: true })
    .where(
      and(
        eq(schema.rapotSemester.kelasId, classId),
        eq(schema.rapotSemester.semester, semester),
        eq(schema.rapotSemester.academicYear, academicYear)
      )
    ).run();

  return c.json({ success: true, message: 'Kelas berhasil difinalisasi' });
};
