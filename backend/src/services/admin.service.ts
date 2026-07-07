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

  async seedUsers(auth: any) {
    await adminRepository.clearAuthTables();
    const accountsToCreate = [
      { name: 'Administrator', email: 'admin@mubtadiaat.id', role: 1 },
      { name: 'Mundzir Lirboyo', email: 'mundzir@mubtadiaat.id', role: 2 },
      { name: 'Mufatish Akademik', email: 'mufatish@mubtadiaat.id', role: 3 },
      { name: 'Mustahiq Kelas', email: 'mustahiq@mubtadiaat.id', role: 4 }
    ];
    const results = [];
    for (const acc of accountsToCreate) {
      const res = await auth.api.signUpEmail({
        body: { email: acc.email, password: 'password123', name: acc.name },
        asResponse: false
      });
      if (res?.user?.id) {
        await adminRepository.updateUserRole(res.user.id, acc.role);
        results.push({ email: acc.email, password: 'password123', role: acc.role });
      }
    }
    return results;
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
