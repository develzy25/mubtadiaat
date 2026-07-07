import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, desc, count, and, like, or } from 'drizzle-orm';

export class AdminRepository {
  // Stats
  async getSantriCountByStatus(status: string) {
    const [result] = await db.select({ count: count() }).from(schema.santri).where(eq(schema.santri.status, status));
    return result.count;
  }
  async getTableCount(tableName: string) {
    const table = this.getTable(tableName);
    const [result] = await db.select({ count: count() }).from(table);
    return result.count;
  }
  async getRecentAuditLogs(limit: number = 5) {
    return await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(limit);
  }
  async getAllAuditLogs() {
    return await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt));
  }

  // Users
  async getUsers() {
    return await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  }
  async createUser(data: any) {
    await db.insert(schema.users).values(data).run();
  }
  async updateUser(id: string, data: any) {
    await db.update(schema.users).set(data).where(eq(schema.users.id, id)).run();
  }
  async deleteUser(id: string) {
    await db.delete(schema.users).where(eq(schema.users.id, id)).run();
  }
  async clearAuthTables() {
    await db.delete(schema.users).run();
    await db.delete(schema.accounts).run();
    await db.delete(schema.sessions).run();
  }
  async updateUserRole(userId: string, roleId: number) {
    await db.update(schema.users).set({ role: roleId }).where(eq(schema.users.id, userId)).run();
  }

  // Generic CRUD generator for simple tables (Asatidz, Blok, etc.)
  private getTable(tableName: string): any {
    return (schema as any)[tableName];
  }

  async getAll(tableName: string) {
    const table = this.getTable(tableName);
    return await db.select().from(table).orderBy(desc(table.createdAt));
  }
  async create(tableName: string, data: any) {
    await db.insert(this.getTable(tableName)).values(data).run();
  }
  async update(tableName: string, id: string, data: any) {
    const table = this.getTable(tableName);
    // Explicitly add updatedAt if not present
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await db.update(table).set(payload).where(eq(table.id, id)).run();
  }
  async delete(tableName: string, id: string) {
    const table = this.getTable(tableName);
    await db.delete(table).where(eq(table.id, id)).run();
  }

  // Complex queries (Joins)
  async getKamar() {
    return await db.select({
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
  }

  async getJenjang() {
    return await db.select({
      id: schema.jenjang.id,
      name: schema.jenjang.name,
      mufatishId: schema.jenjang.mufatishId,
      mufatishName: schema.asatidz.name
    })
    .from(schema.jenjang)
    .leftJoin(schema.asatidz, eq(schema.jenjang.mufatishId, schema.asatidz.id))
    .orderBy(desc(schema.jenjang.createdAt));
  }

  async getTingkat() {
    return await db.select({
      id: schema.tingkat.id,
      romanName: schema.tingkat.name,
      jenjangId: schema.tingkat.jenjangId,
      jenjangName: schema.jenjang.name,
      targetNadzom: schema.tingkat.targetNadzom,
      targetBait: schema.tingkat.targetBait,
      hasPraktek: schema.tingkat.hasPraktek
    })
    .from(schema.tingkat)
    .leftJoin(schema.jenjang, eq(schema.tingkat.jenjangId, schema.jenjang.id))
    .orderBy(desc(schema.tingkat.createdAt));
  }

  async getKelas() {
    return await db.select({
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
  }

  async getKitab() {
    return await db.select({
      id: schema.kitab.id,
      name: schema.kitab.name,
      fanIlmu: schema.kitab.fanIlmu,
      tingkatId: schema.kitab.tingkatId,
      tingkatName: schema.tingkat.name,
      jenjangId: schema.tingkat.jenjangId,
      jenjangName: schema.jenjang.name
    })
    .from(schema.kitab)
    .leftJoin(schema.tingkat, eq(schema.kitab.tingkatId, schema.tingkat.id))
    .leftJoin(schema.jenjang, eq(schema.tingkat.jenjangId, schema.jenjang.id))
    .orderBy(desc(schema.kitab.createdAt));
  }

  async getSantri(filters?: { status?: string; search?: string; kelasId?: string }) {
    let baseQuery = db.select({
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
    .leftJoin(schema.blok, eq(schema.kamar.blokId, schema.blok.id));

    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(schema.santri.status, filters.status));
    }
    if (filters?.kelasId) {
      conditions.push(eq(schema.santri.kelasId, filters.kelasId));
    }
    if (filters?.search) {
      const s = `%${filters.search}%`;
      conditions.push(
        or(
          like(schema.santri.name, s),
          like(schema.santri.noStambuk, s),
          like(schema.santri.nik, s)
        )
      );
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }

    return await baseQuery.orderBy(desc(schema.santri.createdAt));
  }

  async getJadwal() {
    return await db.select({
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
  }

  async getRapotSemester() {
    return await db.select({
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
  }

  async getRapotById(id: string) {
    const [result] = await db.select().from(schema.rapotSemester).where(eq(schema.rapotSemester.id, id));
    return result;
  }
}

export const adminRepository = new AdminRepository();
