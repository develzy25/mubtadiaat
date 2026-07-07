import { adminRepository } from '../repositories/admin.repository';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

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
    
    return {
      metrics: { active, boyong, cuti, classes, usersCount, kamarCount, santriCount, asatidz },
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
    return { id };
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
      // @ts-ignore
      await db.delete((require('../db/schema')[table])).run();
    }

    // 2. Insert Settings
    // @ts-ignore
    await db.insert(require('../db/schema').settings).values({ id: 'global', activeAcademicYear: '2026-2027' }).run();

    // 3. Create Admin
    const res = await auth.api.signUpUsername({
      body: { username: 'admin', password: 'mubtadiaat123', name: 'Administrator' },
      asResponse: false
    });
    if (res?.user?.id) {
      await adminRepository.updateUserRoleAndUsername(res.user.id, 1, 'admin');
    }

    // 4. Create Asatidz (Mundzir, Mufatish, Mustahiq)
    const asatidzList = [
      { id: 'ast_1', name: 'Ust. Mundzir', nip: '111', role: 'Mundzir' },
      { id: 'ast_2', name: 'Ust. Mufatish', nip: '222', role: 'Mufatish' },
      { id: 'ast_3', name: 'Ust. Mustahiq', nip: '333', role: 'Mustahiq' }
    ];
    // @ts-ignore
    await db.insert(require('../db/schema').asatidz).values(asatidzList).run();

    // Generate accounts for them
    await this.generateAccountAsatidz('ast_1', auth); // Mundzir
    await this.generateAccountAsatidz('ast_2', auth); // Mufatish
    await this.generateAccountAsatidz('ast_3', auth); // Mustahiq

    // 5. Blok & Kamar
    // @ts-ignore
    await db.insert(require('../db/schema').blok).values([{ id: 'blk_1', name: 'Blok A' }]).run();
    // @ts-ignore
    await db.insert(require('../db/schema').kamar).values([{ id: 'kmr_1', name: 'A.01', blokId: 'blk_1' }]).run();

    // 6. Jenjang, Tingkat, Kelas
    // @ts-ignore
    await db.insert(require('../db/schema').jenjang).values([{ id: 'jjg_1', name: 'Ibtidaiyyah' }, { id: 'jjg_2', name: 'Tsanawiyah' }]).run();
    
    // @ts-ignore
    await db.insert(require('../db/schema').tingkat).values([
      { id: 'tkt_1', name: 'I', jenjangId: 'jjg_1' },
      { id: 'tkt_2', name: 'II', jenjangId: 'jjg_1' },
      { id: 'tkt_3', name: 'I', jenjangId: 'jjg_2' }
    ]).run();

    // @ts-ignore
    await db.insert(require('../db/schema').kelas).values([
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
    // @ts-ignore
    await db.insert(require('../db/schema').kitab).values(kitabList).run();

    // 8. Santri
    const santriList = [];
    for (let i = 1; i <= 20; i++) {
      santriList.push({
        id: `str_${i}`,
        noStambuk: `STB${2026000 + i}`,
        name: `Santriwati ${i}`,
        kelasId: i <= 10 ? 'kls_1' : 'kls_2',
        kamarId: 'kmr_1'
      });
    }
    // @ts-ignore
    await db.insert(require('../db/schema').santri).values(santriList).run();

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


    const res = await auth.api.signUpUsername({
      body: { username, password: 'mubtadiaat123', name: asatidz.name },
      asResponse: false
    });

    if (res?.user?.id) {
      await adminRepository.updateUserRoleAndUsername(res.user.id, roleId, username);
      await adminRepository.update('asatidz', id, { userId: res.user.id });
      return { success: true, username, password: 'mubtadiaat123' };
    }
    throw new Error("Gagal membuat akun");
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
}

export const adminService = new AdminService();
