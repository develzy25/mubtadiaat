import { Context } from 'hono';
import { adminService } from '../services/admin.service';

export const getStats = async (c: Context) => {
  const data = await adminService.getDashboardStats();
  return c.json({ success: true, data });
};

export const getLogs = async (c: Context) => {
  const logs = await adminService.getLogs();
  return c.json({ success: true, data: logs });
};

// Users
export const getUsers = async (c: Context) => {
  const users = await adminService.getUsers();
  return c.json({ success: true, data: { users, classes: [] } });
};
export const createUser = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.createUser(body);
  return c.json({ success: true, data });
};
export const updateUser = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  const data = await adminService.updateUser(id, body);
  return c.json({ success: true, data });
};
export const deleteUser = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.deleteUser(id);
  return c.json({ success: true });
};
export const resetUserPassword = async (c: Context) => {
  // Mocked for now (was mocked in original too)
  return c.json({ success: true });
};
export const seedUsers = async (c: Context) => {
  try {
    const { getAuth } = await import('../lib/auth.js');
    const auth = getAuth(c.env, c.req.url);
    const results = await adminService.seedUsers(auth);
    return c.json({ success: true, message: 'Database seeded', data: results });
  } catch (error: any) {
    return c.json({ success: false, error: error.message });
  }
};

// Asatidz
export const getAsatidz = async (c: Context) => {
  const data = await adminService.getAll('asatidz');
  return c.json({ success: true, data });
};
export const createAsatidz = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('asatidz', body, 'ast');
  return c.json({ success: true, data });
};
export const updateAsatidz = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('asatidz', id, body);
  return c.json({ success: true });
};
export const deleteAsatidz = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('asatidz', id);
  return c.json({ success: true });
};

export const generateAccountAsatidz = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const { getAuth } = await import('../lib/auth.js');
    const auth = getAuth(c.env, c.req.url);
    const result = await adminService.generateAccountAsatidz(id, auth);
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 400);
  }
};

// Blok
export const getBlok = async (c: Context) => {
  const data = await adminService.getAll('blok');
  return c.json({ success: true, data });
};
export const createBlok = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('blok', body, 'blk');
  return c.json({ success: true, data });
};
export const updateBlok = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('blok', id, body);
  return c.json({ success: true });
};
export const deleteBlok = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('blok', id);
  return c.json({ success: true });
};

// Kamar
export const getKamar = async (c: Context) => {
  const data = await adminService.getKamar();
  return c.json({ success: true, data });
};
export const createKamar = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('kamar', body, 'kmr');
  return c.json({ success: true, data });
};
export const updateKamar = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('kamar', id, body);
  return c.json({ success: true });
};
export const deleteKamar = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('kamar', id);
  return c.json({ success: true });
};

// Jenjang
export const getJenjang = async (c: Context) => {
  const data = await adminService.getJenjang();
  return c.json({ success: true, data });
};
export const createJenjang = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('jenjang', body, 'jjg');
  return c.json({ success: true, data });
};
export const updateJenjang = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('jenjang', id, body);
  return c.json({ success: true });
};
export const deleteJenjang = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('jenjang', id);
  return c.json({ success: true });
};

// Tingkat
export const getTingkat = async (c: Context) => {
  const data = await adminService.getTingkat();
  return c.json({ success: true, data });
};
export const createTingkat = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('tingkat', body, 'tkt');
  return c.json({ success: true, data });
};
export const updateTingkat = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('tingkat', id, body);
  return c.json({ success: true });
};
export const deleteTingkat = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('tingkat', id);
  return c.json({ success: true });
};

// Kelas
export const getKelas = async (c: Context) => {
  const data = await adminService.getKelas();
  return c.json({ success: true, data });
};
export const createKelas = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('kelas', body, 'kls');
  return c.json({ success: true, data });
};
export const updateKelas = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('kelas', id, body);
  return c.json({ success: true });
};
export const deleteKelas = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('kelas', id);
  return c.json({ success: true });
};

// Kitab
export const getKitab = async (c: Context) => {
  const data = await adminService.getKitab();
  return c.json({ success: true, data });
};
export const createKitab = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('kitab', body, 'ktb');
  return c.json({ success: true, data });
};
export const updateKitab = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('kitab', id, body);
  return c.json({ success: true });
};
export const deleteKitab = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('kitab', id);
  return c.json({ success: true });
};

// Santri
export const getSantri = async (c: Context) => {
  const status = c.req.query('status');
  const search = c.req.query('search');
  const kelasId = c.req.query('kelasId');
  const filters = { status, search, kelasId };
  
  const list = await adminService.getSantri(filters);
  return c.json({ success: true, data: list, meta: { total: list.length } });
};
export const createSantri = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('santri', body, 'str');
  return c.json({ success: true, data });
};
export const updateSantri = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('santri', id, body);
  return c.json({ success: true });
};
export const deleteSantri = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('santri', id);
  return c.json({ success: true });
};

// Jadwal
export const getJadwal = async (c: Context) => {
  const data = await adminService.getJadwal();
  return c.json({ success: true, data });
};
export const createJadwal = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('jadwalPelajaran', body, 'jdw');
  return c.json({ success: true, data });
};
export const updateJadwal = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  await adminService.update('jadwalPelajaran', id, body);
  return c.json({ success: true });
};
export const deleteJadwal = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('jadwalPelajaran', id);
  return c.json({ success: true });
};

// Rapot Semester
export const getRapotSemester = async (c: Context) => {
  const data = await adminService.getRapotSemester();
  return c.json({ success: true, data });
};
export const createRapotSemester = async (c: Context) => {
  const body = await c.req.json();
  const data = await adminService.create('rapotSemester', body, 'rpt');
  return c.json({ success: true, data });
};
export const updateRapotSemester = async (c: Context) => {
  const id = c.req.param('id') || '';
  const body = await c.req.json();
  try {
    await adminService.updateRapotSemester(id, body);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 403);
  }
};
export const deleteRapotSemester = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.delete('rapotSemester', id);
  return c.json({ success: true });
};

// Finalisasi
export const finalisasiRapot = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.finalisasiRapot(id);
  return c.json({ success: true, message: 'Nilai berhasil difinalisasi dan dikunci.' });
};
export const unlockRapot = async (c: Context) => {
  const id = c.req.param('id') || '';
  await adminService.unlockRapot(id);
  return c.json({ success: true, message: 'Kunci nilai berhasil dibuka.' });
};
