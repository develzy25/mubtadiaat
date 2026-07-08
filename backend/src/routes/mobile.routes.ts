import { Hono } from 'hono';
import * as mobileController from '../controllers/mobile.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const mobile = new Hono();

// Apply Auth Middleware to all mobile routes
mobile.use('*', authMiddleware);

// Presensi
mobile.get('/presensi/:classId', mobileController.getPresensiHarian);
mobile.post('/presensi/:classId', mobileController.savePresensiHarian);

// Kelas Mustahiq
mobile.get('/kelas', mobileController.getKelasMustahiq);

// Jadwal Mengajar (Munawwibah/Mustahiq)
mobile.get('/jadwal', mobileController.getJadwalMengajar);

// Dashboard Mobile
mobile.get('/dashboard', mobileController.getDashboard);

// Tugas / Penilaian Lama (To be removed/replaced)
mobile.get('/tugas', mobileController.getTugasList);
mobile.post('/tugas', mobileController.saveTugas);

// NEW: Penilaian Kuartal & Finalisasi (Blueprint)
mobile.get('/penilaian/kelas', mobileController.getPenilaianKelas);
mobile.post('/penilaian/input', mobileController.savePenilaianKuartal);
mobile.get('/penilaian/status-kelas', mobileController.getStatusKelas);
mobile.post('/penilaian/finalisasi/:classId', mobileController.finalisasiKelas);

// Rekap Presensi
mobile.get('/rekap/presensi', mobileController.getRekapPresensi);

export default mobile;