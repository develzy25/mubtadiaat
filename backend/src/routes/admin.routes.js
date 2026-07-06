import { Hono } from 'hono';
import * as adminController from '../controllers/admin.controller';
const admin = new Hono();
// Auth & Users
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
admin.get('/logs', adminController.getLogs);
export default admin;
