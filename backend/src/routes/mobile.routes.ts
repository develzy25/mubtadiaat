import { Hono } from 'hono';
import * as mobileController from '../controllers/mobile.controller.js';

const mobile = new Hono();

// Presensi
mobile.get('/presensi/:classId', mobileController.getPresensiHarian);
mobile.post('/presensi/:classId', mobileController.savePresensiHarian);

// Kelas Mustahiq
mobile.get('/kelas', mobileController.getKelasMustahiq);

// Jadwal Mengajar (Munawwibah/Mustahiq)
mobile.get('/jadwal', mobileController.getJadwalMengajar);

// Dashboard Mobile
mobile.get('/dashboard', mobileController.getDashboard);

export default mobile;