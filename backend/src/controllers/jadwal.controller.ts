import { Context } from 'hono';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const getJadwalByClass = async (c: Context) => {
  const classId = c.req.param('classId');
  const kwartal = parseInt(c.req.query('kwartal') || '1');
  const year = c.req.query('year') || '2026-2027';

  if (!classId) return c.json({ success: false, message: 'Class ID required' }, 400);

  const list = await db.select({
    id: schema.jadwalPelajaran.id,
    kelasId: schema.jadwalPelajaran.kelasId,
    hari: schema.jadwalPelajaran.hari,
    sesi: schema.jadwalPelajaran.sesi,
    kitabId: schema.jadwalPelajaran.kitabId,
    pengajarId: schema.jadwalPelajaran.pengajarId,
    kwartal: schema.jadwalPelajaran.kwartal,
    academicYear: schema.jadwalPelajaran.academicYear,
    kitabName: schema.kitab.name,
    pengajar: schema.asatidz.name,
  })
  .from(schema.jadwalPelajaran)
  .leftJoin(schema.kitab, eq(schema.jadwalPelajaran.kitabId, schema.kitab.id))
  .leftJoin(schema.asatidz, eq(schema.jadwalPelajaran.pengajarId, schema.asatidz.id))
  .where(
    and(
      eq(schema.jadwalPelajaran.kelasId, classId),
      eq(schema.jadwalPelajaran.kwartal, kwartal),
      eq(schema.jadwalPelajaran.academicYear, year)
    )
  );

  return c.json({ success: true, data: list });
};

export const saveJadwalBatch = async (c: Context) => {
  const body = await c.req.json();
  const { classId, kwartal, academicYear, items } = body;

  if (!classId || !items || !Array.isArray(items)) {
    return c.json({ success: false, message: 'Invalid payload' }, 400);
  }

  // Fetch class tingkatId
  const classObj = await db.select().from(schema.kelas).where(eq(schema.kelas.id, classId)).limit(1);
  const tingkatId = classObj[0]?.tingkatId || 'default-tingkat-id';

  // Helper to find or create kitab by name
  const resolveKitab = async (name: string) => {
    if (!name) return null;
    const existing = await db.select().from(schema.kitab).where(eq(schema.kitab.name, name)).limit(1);
    if (existing.length > 0) return existing[0].id;
    const newId = 'ktb_' + Date.now() + Math.random().toString(36).substring(7);
    await db.insert(schema.kitab).values({ id: newId, name, tingkatId });
    return newId;
  };

  // Helper to find or create asatidz by name
  const resolveAsatidz = async (name: string) => {
    if (!name) return null;
    const existing = await db.select().from(schema.asatidz).where(eq(schema.asatidz.name, name)).limit(1);
    if (existing.length > 0) return existing[0].id;
    const newId = 'ast_' + Date.now() + Math.random().toString(36).substring(7);
    await db.insert(schema.asatidz).values({ id: newId, name, nip: '-' });
    return newId;
  };

  // Resolve all names to IDs before transaction
  const resolvedItems = [];
  for (const item of items) {
    if (!item.kitabName) continue; // Skip empty cells
    const kitabId = await resolveKitab(item.kitabName);
    const pengajarId = await resolveAsatidz(item.pengajar);
    if (kitabId) {
      resolvedItems.push({
        id: 'jdw_' + Date.now() + '_' + Math.random().toString(36).substring(7),
        kelasId: classId,
        hari: item.hari,
        sesi: item.sesi,
        kitabId,
        pengajarId,
        kwartal: kwartal,
        academicYear: academicYear,
      });
    }
  }

  // Clear existing schedule for this class, kwartal, year
  await db.delete(schema.jadwalPelajaran).where(
    and(
      eq(schema.jadwalPelajaran.kelasId, classId),
      eq(schema.jadwalPelajaran.kwartal, kwartal),
      eq(schema.jadwalPelajaran.academicYear, academicYear)
    )
  );

  // Insert new items
  if (resolvedItems.length > 0) {
    await db.insert(schema.jadwalPelajaran).values(resolvedItems);
  }

  return c.json({ success: true, message: 'Jadwal saved successfully' });
};
