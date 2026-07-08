import { adminRepository } from '../repositories/admin.repository';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index';
import * as schema from '../db/schema';
import { eq, count } from 'drizzle-orm';

export class AdminService {
  async getDashboardStats() {
    const active = await adminRepository.getSantriCountByStatus('ACTIVE');
    const boyong = await adminRepository.getSantriCountByStatus('BOYONG');
    const cuti = await adminRepository.getSantriCountByStatus('CUTI');
    const classes = await adminRepository.getTableCount('kelas');
    const usersCount = await adminRepository.getTableCount('users');
    const kamarCount = await adminRepository.getTableCount('kamar');
    const santriCount = await adminRepository.getTableCount('santri');
    const asatidz = await adminRepository.getTableCount('asatidz');
    const recentActivities = await adminRepository.getRecentAuditLogs(5);

    // 1. Total nilai terisi
    let nilaiTerisi = 0;
    const rns = await db.select().from(schema.rapotNilai);
    for (const rn of rns) {
      if (rn.kuartal1Score !== null && rn.kuartal1Score !== undefined) nilaiTerisi++;
      if (rn.kuartal2Score !== null && rn.kuartal2Score !== undefined) nilaiTerisi++;
      if (rn.kuartal3Score !== null && rn.kuartal3Score !== undefined) nilaiTerisi++;
      if (rn.kuartal4Score !== null && rn.kuartal4Score !== undefined) nilaiTerisi++;
    }

    // 2. Kelas yang sudah final
    const rapots = await db.select().from(schema.rapotSemester);
    const finalizedClassIds = new Set(
      rapots.filter(r => r.isFinalized).map(r => r.kelasId)
    );
    const kelasFinal = finalizedClassIds.size;
    
    return {
      metrics: { 
        active, boyong, cuti, classes, usersCount, kamarCount, santriCount, asatidz,
        nilaiTerisi, kelasFinal
      },
      recentActivities,
      attendanceTrends: []
    };
  }

  async getSettings() {
    return await adminRepository.getSettings();
  }

  async updateSettings(activeAcademicYear: string) {
    await adminRepository.updateSettings(activeAcademicYear);
  }

  async getLogs() {
    return await adminRepository.getAllAuditLogs();
  }

  async getUsers() {
    return await adminRepository.getUsers();
  }
  async createUser(body: any) {
    const id = uuidv4();
    await adminRepository.createUser({ id, ...body });
    const passwordHash = await (await import('better-auth/crypto')).hashPassword('mubtadiaat123');
    await db.insert(schema.accounts).values({ id: uuidv4(), userId: id, accountId: body.username, providerId: 'credential', password: passwordHash }).run();
    return { id };
  }

  async resetUserPassword(id: string) {
    const user = await db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    if (!user) throw new Error("User not found");
    const passwordHash = await (await import('better-auth/crypto')).hashPassword('mubtadiaat123');
    
    const account = await db.select().from(schema.accounts).where(eq(schema.accounts.userId, id)).get();
    if (account) {
      await db.update(schema.accounts).set({ password: passwordHash }).where(eq(schema.accounts.userId, id)).run();
    } else {
      await db.insert(schema.accounts).values({ id: uuidv4(), userId: id, accountId: user.username, providerId: 'credential', password: passwordHash }).run();
    }
  }
  async updateUser(id: string, body: any) {
    await adminRepository.updateUser(id, body);
    return { id };
  }
  async deleteUser(id: string) {
    await adminRepository.deleteUser(id);
  }

  async seedFullData(auth: any, db: any) {
    // 1. Wipe database (clear all relevant tables)
    const tablesToClear = ['users', 'accounts', 'sessions', 'settings', 'blok', 'kamar', 'jenjang', 'tingkat', 'kelas', 'kitab', 'asatidz', 'santri', 'jadwalPelajaran', 'rapotSemester'];
    for (const table of tablesToClear) {
      await db.delete((schema as any)[table]).run();
    }

    // 2. Insert Settings
    await db.insert(schema.settings).values({ id: 'global', activeAcademicYear: '2026-2027' }).run();

    const adminId = uuidv4();
    const adminPasswordHash = await (await import('better-auth/crypto')).hashPassword('mubtadiaat123');
    await db.insert(schema.users).values({ id: adminId, username: 'admin', name: 'Administrator', role: 1 }).run();
    await db.insert(schema.accounts).values({ id: uuidv4(), userId: adminId, accountId: 'admin', providerId: 'credential', password: adminPasswordHash }).run();


    // 4. Create Asatidz (Mundzir, Mufatish, Mustahiq)
    const asatidzList = [
      { id: 'ast_1', name: 'Ust. Mundzir', nip: '111', role: 'Mundzir' },
      { id: 'ast_2', name: 'Ust. Mufatish', nip: '222', role: 'Mufatish' },
      { id: 'ast_3', name: 'Ust. Mustahiq', nip: '333', role: 'Mustahiq' }
    ];
    await db.insert(schema.asatidz).values(asatidzList).run();

    // Generate accounts for them
    await this.generateAccountAsatidz('ast_1', auth); // Mundzir
    await this.generateAccountAsatidz('ast_2', auth); // Mufatish
    await this.generateAccountAsatidz('ast_3', auth); // Mustahiq

    // 5. Blok & Kamar
    await db.insert(schema.blok).values([{ id: 'blk_1', name: 'Blok A' }]).run();
    await db.insert(schema.kamar).values([{ id: 'kmr_1', name: 'A.01', blokId: 'blk_1' }]).run();

    // 6. Jenjang, Tingkat, Kelas
    await db.insert(schema.jenjang).values([{ id: 'jjg_1', name: 'Ibtidaiyyah' }, { id: 'jjg_2', name: 'Tsanawiyah' }]).run();
    
    await db.insert(schema.tingkat).values([
      { id: 'tkt_1', name: 'I', jenjangId: 'jjg_1' },
      { id: 'tkt_2', name: 'II', jenjangId: 'jjg_1' },
      { id: 'tkt_3', name: 'I', jenjangId: 'jjg_2' }
    ]).run();

    await db.insert(schema.kelas).values([
      { id: 'kls_1', bagian: 'I-A', lokal: 'Gedung A', tingkatId: 'tkt_1', mustahiqId: 'ast_3' },
      { id: 'kls_2', bagian: 'I-A Ts', lokal: 'Gedung B', tingkatId: 'tkt_3', mustahiqId: 'ast_3' }
    ]).run();

    // 7. Kitab (with Fan Ilmu)
    const fanIlmu = ['التفسير', 'الحديث', 'التوحيد', 'الفقه', 'الأخلاق', 'النحو', 'التاريخ'];
    const kitabList = fanIlmu.map((fan, idx) => ({
      id: `ktb_${idx}`,
      name: `Kitab ${fan}`,
      fanIlmu: fan,
      tingkatId: idx % 2 === 0 ? 'tkt_1' : 'tkt_3'
    }));
    await db.insert(schema.kitab).values(kitabList).run();

    // 8. Santri
    for (let i = 1; i <= 20; i++) {
      await db.insert(schema.santri).values({
        id: `str_${i}`,
        noStambuk: `STB${2026000 + i}`,
        name: `Santriwati ${i}`,
        kelasId: i <= 10 ? 'kls_1' : 'kls_2',
        kamarId: 'kmr_1'
      }).run();
    }

    return { message: "Database wiped and seeded with dummy data successfully!" };
  }

  async generateAccountAsatidz(id: string, auth: any) {
    const asatidz = await adminRepository.getById('asatidz', id);
    if (!asatidz) throw new Error("Pengurus tidak ditemukan");
    if (asatidz.userId) throw new Error("Pengurus ini sudah memiliki akun");

    const roleMapping: Record<string, number> = {
      'Admin': 1,
      'Mundzir': 2,
      'Mufatish': 3,
      'Mustahiq': 4,
      'Munawwib': 4
    };
    const roleId = roleMapping[asatidz.role] || 4;
    
    // Clean name: use first and middle name separated by dot
    const nameParts = asatidz.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    let username = nameParts.length >= 2 
      ? `${nameParts[0]}.${nameParts[1]}`
      : (nameParts.length === 1 ? nameParts[0] : `user${Math.floor(Math.random() * 100)}`);


    const userId = uuidv4();
    const passwordHash = await (await import('better-auth/crypto')).hashPassword('mubtadiaat123');
    await db.insert(schema.users).values({ id: userId, username, name: asatidz.name, role: roleId }).run();
    await db.insert(schema.accounts).values({ id: uuidv4(), userId, accountId: username, providerId: 'credential', password: passwordHash }).run();

    await adminRepository.update('asatidz', id, { userId: userId });
    return { success: true, username, password: 'mubtadiaat123' };
  }

  async getAsatidz() {
    return await adminRepository.getAsatidzWithUsername();
  }

  // Generic
  async getAll(tableName: string) {
    return await adminRepository.getAll(tableName);
  }
  async create(tableName: string, body: any, prefix: string) {
    const id = prefix + '_' + Date.now();
    await adminRepository.create(tableName, { id, ...body });
    return { id };
  }
  async update(tableName: string, id: string, body: any) {
    await adminRepository.update(tableName, id, body);
    return { id };
  }
  async delete(tableName: string, id: string) {
    await adminRepository.delete(tableName, id);
  }

  // Specific Joins
  async getKamar() { return await adminRepository.getKamar(); }
  async getJenjang() { return await adminRepository.getJenjang(); }
  async getTingkat() { return await adminRepository.getTingkat(); }
  async getKelas() { return await adminRepository.getKelas(); }
  async getKitab() { return await adminRepository.getKitab(); }
  async getSantri(filters?: any) { return await adminRepository.getSantri(filters); }
  async getJadwal() { return await adminRepository.getJadwal(); }
  async getRapotSemester() { return await adminRepository.getRapotSemester(); }

  // Finalisasi
  async updateRapotSemester(id: string, body: any) {
    const existing = await adminRepository.getRapotById(id);
    if (existing && (existing as any).isFinalized) {
      throw new Error('Data Rapot sudah difinalisasi dan dikunci.');
    }
    await adminRepository.update('rapotSemester', id, body);
  }
  async finalisasiRapot(id: string) {
    await adminRepository.update('rapotSemester', id, { isFinalized: true });
  }
  async unlockRapot(id: string) {
    await adminRepository.update('rapotSemester', id, { isFinalized: false });
  }
  async getMonitoringData() {
    // 1. Progres Penilaian per Kelas
    const kelasList = await db.select({
      id: schema.kelas.id,
      bagian: schema.kelas.bagian,
      lokal: schema.kelas.lokal,
      mustahiqName: schema.asatidz.name,
      tingkatName: schema.tingkat.name,
      jenjangName: schema.jenjang.name,
      tingkatId: schema.kelas.tingkatId,
    })
    .from(schema.kelas)
    .leftJoin(schema.asatidz, eq(schema.kelas.mustahiqId, schema.asatidz.id))
    .leftJoin(schema.tingkat, eq(schema.kelas.tingkatId, schema.tingkat.id))
    .leftJoin(schema.jenjang, eq(schema.tingkat.jenjangId, schema.jenjang.id));

    const result = [];
    for (const k of kelasList) {
      // count total santri
      const [santriCountObj] = await db.select({ count: count() })
        .from(schema.santri)
        .where(eq(schema.santri.kelasId, k.id));
      const totalSantri = santriCountObj.count;

      // check if finalized
      const rapotList = await db.select().from(schema.rapotSemester).where(eq(schema.rapotSemester.kelasId, k.id));
      const isFinalized = rapotList.length > 0 && rapotList.every(r => r.isFinalized);
      
      // count filled grades
      let filledGradesCount = 0;
      let totalGradesExpected = 0;
      if (totalSantri > 0) {
        // get all kitabs for this class
        const kitabs = await db.select().from(schema.kitab).where(eq(schema.kitab.tingkatId, k.tingkatId || ''));
        totalGradesExpected = totalSantri * kitabs.length * 4; // 4 kuartal
        
        // count actual filled scores
        for (const r of rapotList) {
          const rns = await db.select().from(schema.rapotNilai).where(eq(schema.rapotNilai.rapotId, r.id));
          for (const rn of rns) {
            if (rn.kuartal1Score !== null && rn.kuartal1Score !== undefined) filledGradesCount++;
            if (rn.kuartal2Score !== null && rn.kuartal2Score !== undefined) filledGradesCount++;
            if (rn.kuartal3Score !== null && rn.kuartal3Score !== undefined) filledGradesCount++;
            if (rn.kuartal4Score !== null && rn.kuartal4Score !== undefined) filledGradesCount++;
          }
        }
      }

      // class status
      let status = 'Draft';
      if (isFinalized) {
        status = 'SUDAH FINAL';
      } else if (filledGradesCount > 0 && filledGradesCount >= totalGradesExpected) {
        status = 'Siap Finalisasi';
      } else if (filledGradesCount > 0) {
        status = 'Progress';
      }

      result.push({
        id: k.id,
        name: k.jenjangName ? `${k.jenjangName} - ${k.tingkatName} ${k.bagian}` : `Kelas ${k.bagian}`,
        wali: k.mustahiqName || 'Belum ditentukan',
        totalSantri,
        status,
        progress: totalGradesExpected > 0 ? Math.round((filledGradesCount / totalGradesExpected) * 100) : 0,
      });
    }

    return result;
  }
}

export const adminService = new AdminService();
