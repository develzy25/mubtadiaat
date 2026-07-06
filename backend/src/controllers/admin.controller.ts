import { Context } from 'hono';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, desc, count } from 'drizzle-orm';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export const getStats = async (c: Context) => {
  const [activeCount] = await db.select({ count: count() }).from(schema.santri).where(eq(schema.santri.status, 'ACTIVE'));
  const [boyongCount] = await db.select({ count: count() }).from(schema.santri).where(eq(schema.santri.status, 'BOYONG'));
  const [cutiCount] = await db.select({ count: count() }).from(schema.santri).where(eq(schema.santri.status, 'CUTI'));
  const [classesCount] = await db.select({ count: count() }).from(schema.kelas);
  const [usersCount] = await db.select({ count: count() }).from(schema.users);
  const [kamarCount] = await db.select({ count: count() }).from(schema.kamar);
  const [santriCount] = await db.select({ count: count() }).from(schema.santri);
  
  const recentActivities = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(5);

  return c.json({ 
    success: true, 
    data: { 
      metrics: {
        active: activeCount.count,
        boyong: boyongCount.count,
        cuti: cutiCount.count,
        classes: classesCount.count,
        usersCount: usersCount.count,
        kamarCount: kamarCount.count,
        santriCount: santriCount.count,
      },
      recentActivities, 
      attendanceTrends: [] 
    } 
  });
};

export const getLogs = async (c: Context) => {
  const logs = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt));
  return c.json({ success: true, data: logs });
};

// Users
export const getUsers = async (c: Context) => {
  const allUsers = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  return c.json({ success: true, data: { users: allUsers, classes: [] } });
};
export const createUser = async (c: Context) => {
  const body = await c.req.json();
  const id = uuidv4();
  await db.insert(schema.users).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateUser = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.users).set(body).where(eq(schema.users.id, id));
  return c.json({ success: true, data: { id } });
};
export const deleteUser = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.users).where(eq(schema.users.id, id));
  return c.json({ success: true });
};
export const resetUserPassword = async (c: Context) => {
  return c.json({ success: true });
};

export const seedUsers = async (c: Context) => {
  // Try to use better-auth API if possible, but since we are in controller, 
  // we can also just create dummy users. However better-auth expects specific password hash format.
  // Instead of raw insert, let's just use the server-side API of better-auth
  try {
    const { getAuth } = await import('../lib/auth.js');
    const auth = getAuth(c.env, c.req.url);
    
    // Clear existing users
    await db.delete(schema.users);
    await db.delete(schema.accounts);
    await db.delete(schema.sessions);

    const accountsToCreate = [
      { name: 'Administrator', email: 'admin@mubtadiaat.id', role: 1 },
      { name: 'Mundzir Lirboyo', email: 'mundzir@mubtadiaat.id', role: 2 },
      { name: 'Mufatish Akademik', email: 'mufatish@mubtadiaat.id', role: 3 },
      { name: 'Mustahiq Kelas', email: 'mustahiq@mubtadiaat.id', role: 4 }
    ];

    const results = [];
    for (const acc of accountsToCreate) {
      // Use better-auth internal API to sign up
      const res = await auth.api.signUpEmail({
        body: {
          email: acc.email,
          password: 'password123',
          name: acc.name
        },
        asResponse: false
      });
      
      // Update role explicitly since better-auth might not map it directly without extra config
      if (res?.user?.id) {
        await db.update(schema.users)
          .set({ role: acc.role })
          .where(eq(schema.users.id, res.user.id));
        results.push({ email: acc.email, password: 'password123', role: acc.role });
      }
    }

    return c.json({ success: true, message: 'Database seeded', data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message });
  }
};

// Asatidz
export const getAsatidz = async (c: Context) => {
  const list = await db.select().from(schema.asatidz).orderBy(desc(schema.asatidz.createdAt));
  return c.json({ success: true, data: list });
};
export const createAsatidz = async (c: Context) => {
  const body = await c.req.json();
  const id = 'ast_' + Date.now();
  await db.insert(schema.asatidz).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateAsatidz = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.asatidz).set(body).where(eq(schema.asatidz.id, id));
  return c.json({ success: true });
};
export const deleteAsatidz = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.asatidz).where(eq(schema.asatidz.id, id));
  return c.json({ success: true });
};

// Blok
export const getBlok = async (c: Context) => {
  const list = await db.select().from(schema.blok).orderBy(desc(schema.blok.createdAt));
  return c.json({ success: true, data: list });
};
export const createBlok = async (c: Context) => {
  const body = await c.req.json();
  const id = 'blk_' + Date.now();
  await db.insert(schema.blok).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateBlok = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.blok).set(body).where(eq(schema.blok.id, id));
  return c.json({ success: true });
};
export const deleteBlok = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.blok).where(eq(schema.blok.id, id));
  return c.json({ success: true });
};

// Kamar
export const getKamar = async (c: Context) => {
  const list = await db.select({
    id: schema.kamar.id,
    name: schema.kamar.name,
    blokId: schema.kamar.blokId,
    blokName: schema.blok.name,
    penasihatId: schema.kamar.penasihatId,
    penasihatName: schema.asatidz.name
  })
  .from(schema.kamar)
  .leftJoin(schema.blok, eq(schema.kamar.blokId, schema.blok.id))
  .leftJoin(schema.asatidz, eq(schema.kamar.penasihatId, schema.asatidz.id))
  .orderBy(desc(schema.kamar.createdAt));
  
  return c.json({ success: true, data: list });
};
export const createKamar = async (c: Context) => {
  const body = await c.req.json();
  const id = 'kmr_' + Date.now();
  await db.insert(schema.kamar).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateKamar = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.kamar).set(body).where(eq(schema.kamar.id, id));
  return c.json({ success: true });
};
export const deleteKamar = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.kamar).where(eq(schema.kamar.id, id));
  return c.json({ success: true });
};

// Jenjang
export const getJenjang = async (c: Context) => {
  const list = await db.select({
    id: schema.jenjang.id,
    name: schema.jenjang.name,
    mundzirId: schema.jenjang.mundzirId,
    mundzirName: schema.asatidz.name
  })
  .from(schema.jenjang)
  .leftJoin(schema.asatidz, eq(schema.jenjang.mundzirId, schema.asatidz.id))
  .orderBy(desc(schema.jenjang.createdAt));
  return c.json({ success: true, data: list });
};
export const createJenjang = async (c: Context) => {
  const body = await c.req.json();
  const id = 'jjg_' + Date.now();
  await db.insert(schema.jenjang).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateJenjang = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.jenjang).set(body).where(eq(schema.jenjang.id, id));
  return c.json({ success: true });
};
export const deleteJenjang = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.jenjang).where(eq(schema.jenjang.id, id));
  return c.json({ success: true });
};

// Tingkat
export const getTingkat = async (c: Context) => {
  const list = await db.select({
    id: schema.tingkat.id,
    romanName: schema.tingkat.name,
    jenjangId: schema.tingkat.jenjangId,
    jenjangName: schema.jenjang.name,
    mufatishId: schema.tingkat.mufatishId,
    mufatishName: schema.asatidz.name,
    targetNadzom: schema.tingkat.targetNadzom,
    targetBait: schema.tingkat.targetBait,
    hasPraktek: schema.tingkat.hasPraktek
  })
  .from(schema.tingkat)
  .leftJoin(schema.jenjang, eq(schema.tingkat.jenjangId, schema.jenjang.id))
  .leftJoin(schema.asatidz, eq(schema.tingkat.mufatishId, schema.asatidz.id))
  .orderBy(desc(schema.tingkat.createdAt));
  return c.json({ success: true, data: list });
};
export const createTingkat = async (c: Context) => {
  const body = await c.req.json();
  const id = 'tkt_' + Date.now();
  await db.insert(schema.tingkat).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateTingkat = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.tingkat).set(body).where(eq(schema.tingkat.id, id));
  return c.json({ success: true });
};
export const deleteTingkat = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.tingkat).where(eq(schema.tingkat.id, id));
  return c.json({ success: true });
};

// Kelas
export const getKelas = async (c: Context) => {
  const list = await db.select({
    id: schema.kelas.id,
    bagian: schema.kelas.bagian,
    lokal: schema.kelas.lokal,
    tingkatId: schema.kelas.tingkatId,
    tingkatName: schema.tingkat.name,
    jenjangId: schema.tingkat.jenjangId,
    jenjangName: schema.jenjang.name,
    mustahiqId: schema.kelas.mustahiqId,
    mustahiqName: schema.asatidz.name,
    munawwibIds: schema.kelas.munawwibIds
  })
  .from(schema.kelas)
  .leftJoin(schema.tingkat, eq(schema.kelas.tingkatId, schema.tingkat.id))
  .leftJoin(schema.jenjang, eq(schema.tingkat.jenjangId, schema.jenjang.id))
  .leftJoin(schema.asatidz, eq(schema.kelas.mustahiqId, schema.asatidz.id))
  .orderBy(desc(schema.kelas.createdAt));
  return c.json({ success: true, data: list });
};
export const createKelas = async (c: Context) => {
  const body = await c.req.json();
  const id = 'kls_' + Date.now();
  await db.insert(schema.kelas).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateKelas = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.kelas).set(body).where(eq(schema.kelas.id, id));
  return c.json({ success: true });
};
export const deleteKelas = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.kelas).where(eq(schema.kelas.id, id));
  return c.json({ success: true });
};

// Kitab
export const getKitab = async (c: Context) => {
  const list = await db.select({
    id: schema.kitab.id,
    name: schema.kitab.name,
    fanIlmu: schema.kitab.fanIlmu,
    tingkatId: schema.kitab.tingkatId,
    tingkatName: schema.tingkat.name
  })
  .from(schema.kitab)
  .leftJoin(schema.tingkat, eq(schema.kitab.tingkatId, schema.tingkat.id))
  .orderBy(desc(schema.kitab.createdAt));
  return c.json({ success: true, data: list });
};
export const createKitab = async (c: Context) => {
  const body = await c.req.json();
  const id = 'ktb_' + Date.now();
  await db.insert(schema.kitab).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateKitab = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.kitab).set(body).where(eq(schema.kitab.id, id));
  return c.json({ success: true });
};
export const deleteKitab = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.kitab).where(eq(schema.kitab.id, id));
  return c.json({ success: true });
};

// Santri
export const getSantri = async (c: Context) => {
  const list = await db.select({
    id: schema.santri.id,
    noStambuk: schema.santri.noStambuk,
    nik: schema.santri.nik,
    name: schema.santri.name,
    alamatLengkap: schema.santri.alamatLengkap,
    kelasId: schema.santri.kelasId,
    kelasBagian: schema.kelas.bagian,
    tingkatName: schema.tingkat.name,
    jenjangName: schema.jenjang.name,
    kamarId: schema.santri.kamarId,
    kamarName: schema.kamar.name,
    blokName: schema.blok.name,
    status: schema.santri.status,
    tahunKeluar: schema.santri.tahunKeluar
  })
  .from(schema.santri)
  .leftJoin(schema.kelas, eq(schema.santri.kelasId, schema.kelas.id))
  .leftJoin(schema.tingkat, eq(schema.kelas.tingkatId, schema.tingkat.id))
  .leftJoin(schema.jenjang, eq(schema.tingkat.jenjangId, schema.jenjang.id))
  .leftJoin(schema.kamar, eq(schema.santri.kamarId, schema.kamar.id))
  .leftJoin(schema.blok, eq(schema.kamar.blokId, schema.blok.id))
  .orderBy(desc(schema.santri.createdAt));
  return c.json({ success: true, data: list, meta: { total: list.length } });
};
export const createSantri = async (c: Context) => {
  const body = await c.req.json();
  const id = 'str_' + Date.now();
  await db.insert(schema.santri).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};
export const updateSantri = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.santri).set(body).where(eq(schema.santri.id, id));
  return c.json({ success: true });
};
export const deleteSantri = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.santri).where(eq(schema.santri.id, id));
  return c.json({ success: true });
};

// ==========================================
// Jadwal Pelajaran
// ==========================================
export const getJadwal = async (c: Context) => {
  const list = await db.select({
    id: schema.jadwalPelajaran.id,
    kelasId: schema.jadwalPelajaran.kelasId,
    kitabId: schema.jadwalPelajaran.kitabId,
    hari: schema.jadwalPelajaran.hari,
    sesi: schema.jadwalPelajaran.sesi,
    pengajarId: schema.jadwalPelajaran.pengajarId,
    academicYear: schema.jadwalPelajaran.academicYear,
    kelasName: schema.kelas.bagian,
    kitabName: schema.kitab.name,
    pengajarName: schema.asatidz.name
  })
  .from(schema.jadwalPelajaran)
  .leftJoin(schema.kelas, eq(schema.jadwalPelajaran.kelasId, schema.kelas.id))
  .leftJoin(schema.kitab, eq(schema.jadwalPelajaran.kitabId, schema.kitab.id))
  .leftJoin(schema.asatidz, eq(schema.jadwalPelajaran.pengajarId, schema.asatidz.id))
  .orderBy(desc(schema.jadwalPelajaran.createdAt));
  
  return c.json({ success: true, data: list });
};

export const createJadwal = async (c: Context) => {
  const body = await c.req.json();
  const id = 'jdw_' + Date.now();
  await db.insert(schema.jadwalPelajaran).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};

export const updateJadwal = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await db.update(schema.jadwalPelajaran).set(body).where(eq(schema.jadwalPelajaran.id, id));
  return c.json({ success: true });
};

export const deleteJadwal = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.jadwalPelajaran).where(eq(schema.jadwalPelajaran.id, id));
  return c.json({ success: true });
};

// ==========================================
// E-Rapot & Finalisasi Nilai
// ==========================================
export const getRapotSemester = async (c: Context) => {
  const list = await db.select({
    id: schema.rapotSemester.id,
    santriId: schema.rapotSemester.santriId,
    kelasId: schema.rapotSemester.kelasId,
    semester: schema.rapotSemester.semester,
    academicYear: schema.rapotSemester.academicYear,
    izinCount: schema.rapotSemester.izinCount,
    tanpaIzinCount: schema.rapotSemester.tanpaIzinCount,
    nilaiAkhlaq: schema.rapotSemester.nilaiAkhlaq,
    nilaiPrestasi: schema.rapotSemester.nilaiPrestasi,
    isFinalized: schema.rapotSemester.isFinalized,
    catatan: schema.rapotSemester.catatan,
    santriName: schema.santri.name,
    kelasBagian: schema.kelas.bagian,
    noStambuk: schema.santri.noStambuk
  })
  .from(schema.rapotSemester)
  .leftJoin(schema.santri, eq(schema.rapotSemester.santriId, schema.santri.id))
  .leftJoin(schema.kelas, eq(schema.rapotSemester.kelasId, schema.kelas.id))
  .orderBy(desc(schema.rapotSemester.createdAt));

  return c.json({ success: true, data: list });
};

export const createRapotSemester = async (c: Context) => {
  const body = await c.req.json();
  const id = 'rpt_' + Date.now();
  await db.insert(schema.rapotSemester).values({ id, ...body });
  return c.json({ success: true, data: { id } });
};

export const updateRapotSemester = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  
  // Prevent updating if finalized (unless it's an admin unlocking it, which should go through unlockRapot)
  const [existing] = await db.select().from(schema.rapotSemester).where(eq(schema.rapotSemester.id, id));
  if (existing && existing.isFinalized) {
    return c.json({ success: false, error: 'Data Rapot sudah difinalisasi dan dikunci.' }, 403);
  }

  await db.update(schema.rapotSemester).set(body).where(eq(schema.rapotSemester.id, id));
  return c.json({ success: true });
};

export const deleteRapotSemester = async (c: Context) => {
  const id = c.req.param('id') || '';
  await db.delete(schema.rapotSemester).where(eq(schema.rapotSemester.id, id));
  return c.json({ success: true });
};

// Finalisasi Nilai
export const finalisasiRapot = async (c: Context) => {
  const id = c.req.param('id') || '';
  // Here we would normally calculate Nilai Am, Al Bayan, and set isFinalized = true
  await db.update(schema.rapotSemester).set({ isFinalized: true }).where(eq(schema.rapotSemester.id, id));
  return c.json({ success: true, message: 'Nilai berhasil difinalisasi dan dikunci.' });
};

export const unlockRapot = async (c: Context) => {
  const id = c.req.param('id') || '';
  // Usually this requires admin check via middleware
  await db.update(schema.rapotSemester).set({ isFinalized: false }).where(eq(schema.rapotSemester.id, id));
  return c.json({ success: true, message: 'Kunci nilai berhasil dibuka.' });
};
