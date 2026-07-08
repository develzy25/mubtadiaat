import { getHeaders } from './admin.service';

const API_URL = 'https://mubtadiat-db.eppds.workers.dev/api';
// Fallback if local: 'http://127.0.0.1:8787/api' but since admin service uses prod worker, we do too, 
// wait, better to use process.env.VITE_API_URL if it exists. 
// Admin service hardcodes it, so we'll do the same for consistency.

export const fetchDashboardData = async (role: string) => {
  const res = await fetch(`${API_URL}/mobile/dashboard`, {
    headers: { ...getHeaders(), 'X-Role': role }
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return await res.json();
};

export const fetchKelasMustahiq = async () => {
  const res = await fetch(`${API_URL}/mobile/kelas`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch kelas');
  return await res.json();
};

export const fetchJadwalMengajar = async () => {
  const res = await fetch(`${API_URL}/mobile/jadwal`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch jadwal');
  return await res.json();
};

export const fetchPresensiHarian = async (classId: string) => {
  const res = await fetch(`${API_URL}/mobile/presensi/${classId}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch presensi');
  return await res.json();
};

export const savePresensiHarian = async (classId: string, payload: any) => {
  const res = await fetch(`${API_URL}/mobile/presensi/${classId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to save presensi');
  return await res.json();
};

// Penilaian (Blueprint)
export const fetchPenilaianKelas = async (classId: string, mapel: string, kuartal: string) => {
  const res = await fetch(`${API_URL}/mobile/penilaian/kelas?classId=${classId}&mapel=${mapel}&kuartal=${kuartal}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch penilaian');
  return await res.json();
};

export const savePenilaianKuartal = async (payload: any) => {
  const res = await fetch(`${API_URL}/mobile/penilaian/input`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to save penilaian');
  return await res.json();
};

// Finalisasi & Monitoring
export const fetchStatusKelas = async () => {
  const res = await fetch(`${API_URL}/mobile/penilaian/status-kelas`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch status kelas');
  return await res.json();
};

export const submitFinalisasiKelas = async (classId: string) => {
  const res = await fetch(`${API_URL}/mobile/penilaian/finalisasi/${classId}`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to finalisasi kelas');
  return await res.json();
};

export const fetchRekapPresensi = async () => {
  const res = await fetch(`${API_URL}/mobile/rekap/presensi`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch rekap presensi');
  return await res.json();
};
