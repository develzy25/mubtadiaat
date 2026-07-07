import { getHeaders } from './admin.service';

const API_URL = import.meta.env.VITE_API_URL || 'https://mubtadiat-db.eppds.workers.dev/api';

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'API request failed');
  }
  return res.json();
};

// --- BLOK ---
export const fetchBlok = async () => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/blok`, { headers: getHeaders() }));
export const createBlok = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/blok`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateBlok = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/blok/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteBlok = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/blok/${id}`, { method: 'DELETE', headers: getHeaders() }));

// --- KAMAR ---
export const fetchKamar = async () => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/kamar`, { headers: getHeaders() }));
export const createKamar = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/kamar`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateKamar = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/kamar/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteKamar = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/infrastruktur/kamar/${id}`, { method: 'DELETE', headers: getHeaders() }));

// --- JENJANG ---
export const fetchJenjang = async () => handleResponse(await fetch(`${API_URL}/admin/akademik/jenjang`, { headers: getHeaders() }));
export const createJenjang = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/jenjang`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateJenjang = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/jenjang/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteJenjang = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/akademik/jenjang/${id}`, { method: 'DELETE', headers: getHeaders() }));

// --- TINGKAT ---
export const fetchTingkat = async () => handleResponse(await fetch(`${API_URL}/admin/akademik/tingkat`, { headers: getHeaders() }));
export const createTingkat = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/tingkat`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateTingkat = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/tingkat/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteTingkat = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/akademik/tingkat/${id}`, { method: 'DELETE', headers: getHeaders() }));

// --- KELAS ---
export const fetchKelas = async () => handleResponse(await fetch(`${API_URL}/admin/akademik/kelas`, { headers: getHeaders() }));
export const createKelas = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/kelas`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateKelas = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/kelas/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteKelas = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/akademik/kelas/${id}`, { method: 'DELETE', headers: getHeaders() }));

// --- KITAB ---
export const fetchKitab = async () => handleResponse(await fetch(`${API_URL}/admin/akademik/kitab`, { headers: getHeaders() }));
export const createKitab = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/kitab`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateKitab = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/akademik/kitab/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteKitab = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/akademik/kitab/${id}`, { method: 'DELETE', headers: getHeaders() }));

// --- JADWAL PELAJARAN ---
export const fetchJadwal = async (classId: string, kwartal: number, year: string) => handleResponse(await fetch(`${API_URL}/admin/master/jadwal/${classId}?kwartal=${kwartal}&year=${year}`, { headers: getHeaders() }));
export const saveJadwalBatch = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/master/jadwal/batch`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));

// --- RAPOT ---
export const fetchRapotGrid = async (classId: string, semester: string, year: string) => handleResponse(await fetch(`${API_URL}/admin/rapot/kelas/${classId}?semester=${semester}&year=${year}`, { headers: getHeaders() }));
export const saveRapotBatch = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/rapot/input`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const fetchNilaiAm = async (classId: string, semester: string, year: string) => handleResponse(await fetch(`${API_URL}/admin/rapot/nilai-am/${classId}?semester=${semester}&year=${year}`, { headers: getHeaders() }));
export const fetchRekap = async (santriId: string, year: string) => handleResponse(await fetch(`${API_URL}/admin/rapot/rekap/${santriId}?year=${year}`, { headers: getHeaders() }));
export const finalizeKelas = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/rapot/finalize`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export interface BlokItem {
  id: string;
  name: string;
}

export interface KamarItem {
  id: string;
  name: string;
  blokId: string;
  blokName?: string;
  penasihatId?: string;
  penasihatName?: string;
}

export interface JenjangItem {
  id: string;
  name: string;
  mundzirId?: string;
  mundzirName?: string;
}

export interface TingkatItem {
  id: string;
  name: string;
  jenjangId: string;
  jenjangName?: string;
  mufatishId?: string;
  mufatishName?: string;
  targetNadzom?: string;
  targetBait?: number;
  hasPraktek?: boolean;
}

export interface KelasItem {
  id: string;
  bagian: string;
  lokal?: string;
  tingkatId: string;
  tingkatName?: string;
  jenjangId?: string;
  jenjangName?: string;
  mustahiqId?: string;
  mustahiqName?: string;
  munawwibIds?: string;
}

export interface KitabItem {
  id: string;
  name: string;
  fanIlmu?: string;
  tingkatId: string;
  tingkatName?: string;
}


export interface AsatidzItem {
  id: string;
  name: string;
  role: 'Mundzir' | 'Mufatish' | 'Mustahiq' | 'Munawwib';
  phone: string;
}

export const fetchAsatidz = async () => handleResponse(await fetch(`${API_URL}/admin/asatidz`, { headers: getHeaders() }));
export const createAsatidz = async (data: any) => handleResponse(await fetch(`${API_URL}/admin/asatidz`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }));
export const updateAsatidz = async (id: string, data: any) => handleResponse(await fetch(`${API_URL}/admin/asatidz/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) }));
export const deleteAsatidz = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/asatidz/${id}`, { method: 'DELETE', headers: getHeaders() }));
export const generateAccountAsatidz = async (id: string) => handleResponse(await fetch(`${API_URL}/admin/asatidz/${id}/generate-account`, { method: 'POST', headers: getHeaders() }));
