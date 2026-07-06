import { db } from '../db';
import * as schema from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
export const getStats = async (c) => {
    return c.json({ success: true, data: { metrics: {}, recentActivities: [], attendanceTrends: [] } });
};
export const getLogs = async (c) => {
    return c.json({ success: true, data: [] });
};
// Users
export const getUsers = async (c) => {
    const allUsers = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
    return c.json({ success: true, data: { users: allUsers, classes: [] } });
};
export const createUser = async (c) => {
    const body = await c.req.json();
    const id = uuidv4();
    await db.insert(schema.users).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateUser = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.users).set(body).where(eq(schema.users.id, id));
    return c.json({ success: true, data: { id } });
};
export const deleteUser = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.users).where(eq(schema.users.id, id));
    return c.json({ success: true });
};
export const resetUserPassword = async (c) => {
    return c.json({ success: true });
};
// Asatidz
export const getAsatidz = async (c) => {
    const list = await db.select().from(schema.asatidz).orderBy(desc(schema.asatidz.createdAt));
    return c.json({ success: true, data: list });
};
export const createAsatidz = async (c) => {
    const body = await c.req.json();
    const id = 'ast_' + Date.now();
    await db.insert(schema.asatidz).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateAsatidz = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.asatidz).set(body).where(eq(schema.asatidz.id, id));
    return c.json({ success: true });
};
export const deleteAsatidz = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.asatidz).where(eq(schema.asatidz.id, id));
    return c.json({ success: true });
};
// Blok
export const getBlok = async (c) => {
    const list = await db.select().from(schema.blok).orderBy(desc(schema.blok.createdAt));
    return c.json({ success: true, data: list });
};
export const createBlok = async (c) => {
    const body = await c.req.json();
    const id = 'blk_' + Date.now();
    await db.insert(schema.blok).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateBlok = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.blok).set(body).where(eq(schema.blok.id, id));
    return c.json({ success: true });
};
export const deleteBlok = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.blok).where(eq(schema.blok.id, id));
    return c.json({ success: true });
};
// Kamar
export const getKamar = async (c) => {
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
export const createKamar = async (c) => {
    const body = await c.req.json();
    const id = 'kmr_' + Date.now();
    await db.insert(schema.kamar).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateKamar = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.kamar).set(body).where(eq(schema.kamar.id, id));
    return c.json({ success: true });
};
export const deleteKamar = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.kamar).where(eq(schema.kamar.id, id));
    return c.json({ success: true });
};
// Jenjang
export const getJenjang = async (c) => {
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
export const createJenjang = async (c) => {
    const body = await c.req.json();
    const id = 'jjg_' + Date.now();
    await db.insert(schema.jenjang).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateJenjang = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.jenjang).set(body).where(eq(schema.jenjang.id, id));
    return c.json({ success: true });
};
export const deleteJenjang = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.jenjang).where(eq(schema.jenjang.id, id));
    return c.json({ success: true });
};
// Tingkat
export const getTingkat = async (c) => {
    const list = await db.select({
        id: schema.tingkat.id,
        name: schema.tingkat.name,
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
export const createTingkat = async (c) => {
    const body = await c.req.json();
    const id = 'tkt_' + Date.now();
    await db.insert(schema.tingkat).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateTingkat = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.tingkat).set(body).where(eq(schema.tingkat.id, id));
    return c.json({ success: true });
};
export const deleteTingkat = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.tingkat).where(eq(schema.tingkat.id, id));
    return c.json({ success: true });
};
// Kelas
export const getKelas = async (c) => {
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
export const createKelas = async (c) => {
    const body = await c.req.json();
    const id = 'kls_' + Date.now();
    await db.insert(schema.kelas).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateKelas = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.kelas).set(body).where(eq(schema.kelas.id, id));
    return c.json({ success: true });
};
export const deleteKelas = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.kelas).where(eq(schema.kelas.id, id));
    return c.json({ success: true });
};
// Kitab
export const getKitab = async (c) => {
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
export const createKitab = async (c) => {
    const body = await c.req.json();
    const id = 'ktb_' + Date.now();
    await db.insert(schema.kitab).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateKitab = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.kitab).set(body).where(eq(schema.kitab.id, id));
    return c.json({ success: true });
};
export const deleteKitab = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.kitab).where(eq(schema.kitab.id, id));
    return c.json({ success: true });
};
// Santri
export const getSantri = async (c) => {
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
export const createSantri = async (c) => {
    const body = await c.req.json();
    const id = 'str_' + Date.now();
    await db.insert(schema.santri).values({ id, ...body });
    return c.json({ success: true, data: { id } });
};
export const updateSantri = async (c) => {
    const id = c.req.param('id') || '';
    const body = await c.req.json();
    await db.update(schema.santri).set(body).where(eq(schema.santri.id, id));
    return c.json({ success: true });
};
export const deleteSantri = async (c) => {
    const id = c.req.param('id') || '';
    await db.delete(schema.santri).where(eq(schema.santri.id, id));
    return c.json({ success: true });
};
