import { Hono } from 'hono';
import * as adminController from '../controllers/admin.controller';
import * as jadwalController from '../controllers/jadwal.controller';
import * as rapotController from '../controllers/rapot.controller';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const admin = new Hono<{ Variables: { userRole: number; userId: string; user: any } }>();

admin.use('*', authMiddleware);
admin.use('*', async (c, next) => {
  const role = c.get('userRole');
  if (role !== 1) {
    return c.json({ success: false, message: 'Forbidden: Admin access required' }, 403);
  }
  await next();
});

// Auth & Users
import { seedTsanawiyah } from '../db/seed_tsanawiyah';

admin.get('/seed/full', adminController.seedFullData);
admin.get('/seed/tsanawiyah', async (c) => {
  try {
    const res = await seedTsanawiyah((c.env as any).DB);
    return c.json({ success: true, message: 'Tsanawiyah jadwal seeded successfully', data: res });
  } catch (error: any) {
    return c.json({ success: false, error: error.message });
  }
});
admin.get('/users', adminController.getUsers);
admin.post('/users', adminController.createUser);
admin.put('/users/:id', adminController.updateUser);
admin.delete('/users/:id', adminController.deleteUser);
admin.post('/users/:id/reset-password', adminController.resetUserPassword);

// Asatidz (Master Pengurus)
admin.get('/asatidz', adminController.getAsatidz);
admin.post('/asatidz', adminController.createAsatidz);
admin.put('/asatidz/:id', adminController.updateAsatidz);
admin.delete('/asatidz/:id', adminController.deleteAsatidz);
admin.post('/asatidz/:id/generate-account', adminController.generateAccountAsatidz);

// Master Wilayah
admin.get('/infrastruktur/blok', adminController.getBlok);
admin.post('/infrastruktur/blok', adminController.createBlok);
admin.put('/infrastruktur/blok/:id', adminController.updateBlok);
admin.delete('/infrastruktur/blok/:id', adminController.deleteBlok);

admin.get('/infrastruktur/kamar', adminController.getKamar);
admin.post('/infrastruktur/kamar', adminController.createKamar);
admin.put('/infrastruktur/kamar/:id', adminController.updateKamar);
admin.delete('/infrastruktur/kamar/:id', adminController.deleteKamar);

// Master Akademik
admin.get('/akademik/jenjang', adminController.getJenjang);
admin.post('/akademik/jenjang', adminController.createJenjang);
admin.put('/akademik/jenjang/:id', adminController.updateJenjang);
admin.delete('/akademik/jenjang/:id', adminController.deleteJenjang);

admin.get('/akademik/tingkat', adminController.getTingkat);
admin.post('/akademik/tingkat', adminController.createTingkat);
admin.put('/akademik/tingkat/:id', adminController.updateTingkat);
admin.delete('/akademik/tingkat/:id', adminController.deleteTingkat);

admin.get('/akademik/kelas', adminController.getKelas);
admin.post('/akademik/kelas', adminController.createKelas);
admin.put('/akademik/kelas/:id', adminController.updateKelas);
admin.delete('/akademik/kelas/:id', adminController.deleteKelas);

admin.get('/akademik/kitab', adminController.getKitab);
admin.post('/akademik/kitab', adminController.createKitab);
admin.put('/akademik/kitab/:id', adminController.updateKitab);
admin.delete('/akademik/kitab/:id', adminController.deleteKitab);

// Santri
admin.get('/santri', adminController.getSantri);
admin.post('/santri', adminController.createSantri);
admin.put('/santri/:id', adminController.updateSantri);
admin.delete('/santri/:id', adminController.deleteSantri);

// Dashboard Stats & Logs
admin.get('/stats', adminController.getStats);
admin.get('/settings', adminController.getSettings);
admin.put('/settings', adminController.updateSettings);
admin.get('/logs', adminController.getLogs);

// Jadwal Pelajaran (Advanced)
admin.get('/master/jadwal/:classId', jadwalController.getJadwalByClass);
admin.post('/master/jadwal/batch', jadwalController.saveJadwalBatch);

// E-Rapot (Advanced Grid)
admin.get('/rapot/kelas/:classId', rapotController.getRapotGrid);
admin.post('/rapot/input', rapotController.saveRapotBatch);
admin.get('/rapot/nilai-am/:classId', rapotController.fetchNilaiAm);
admin.get('/rapot/rekap/:santriId', rapotController.fetchRekap);
admin.post('/rapot/finalize', rapotController.finalizeKelas);

// Fallbacks for Simple CRUD if needed
admin.get('/akademik/rapot', adminController.getRapotSemester);
admin.post('/akademik/rapot', adminController.createRapotSemester);
admin.put('/akademik/rapot/:id', adminController.updateRapotSemester);
admin.delete('/akademik/rapot/:id', adminController.deleteRapotSemester);
admin.post('/akademik/rapot/:id/finalisasi', adminController.finalisasiRapot);
admin.post('/akademik/rapot/:id/unlock', adminController.unlockRapot);

export default admin;
