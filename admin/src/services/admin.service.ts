const API_URL = 'https://mubtadiat-db.eppds.workers.dev/api';

export interface SantriAdmin {
  id: string;
  noStambuk: string;
  nik: string;
  name: string;
  tempatLahir: string;
  tanggalLahir: string;
  kelasId: string;
  kelasBagian?: string;
  tingkatName?: string;
  jenjangName?: string;
  alamatLengkap: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kodePos: string;
  noKk: string;
  namaAyah: string;
  namaIbu: string;
  tahunMasuk: string;
  tahunKeluar: string | null;
  kamarId: string;
  kamarName?: string;
  blokName?: string;
  customFields: string | null; // JSON string
  status: 'ACTIVE' | 'ALUMNI' | 'BOYONG' | 'CUTI';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  role: number; // 1=Admin, 2=Mundzir, 3=Mufatish, 4=Mustahiq
  password?: string;
  createdAt?: string;
}

export interface AuditLogAdmin {
  id: string;
  userId: string;
  role: string;
  activity: string;
  tableName: string;
  recordId: string;
  oldData: string | null;
  newData: string | null;
  ipAddress: string;
  device: string;
  createdAt: string;
}

export const getHeaders = () => {
  const token = localStorage.getItem('better-auth.session_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// 1. Stats
export const fetchStats = async () => {
  const res = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
};

// 2. Santri Refs CRUD
export const fetchSantri = async (filters: { kelasId?: string; status?: string; search?: string }) => {
  const params = new URLSearchParams();
  if (filters.kelasId) params.append('kelasId', filters.kelasId);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const res = await fetch(`${API_URL}/admin/santri?${params.toString()}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch santri');
  return await res.json();
};

export const saveSantri = async (data: Partial<SantriAdmin>) => {
  const res = await fetch(`${API_URL}/admin/santri`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save santri');
  return await res.json();
};

export const importSantriBatch = async (data: any[]) => {
  const res = await fetch(`${API_URL}/admin/santri/batch`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ data })
  });
  if (!res.ok) throw new Error('Failed to import santri batch');
  return await res.json();
};

export const updateSantri = async (id: string, data: Partial<SantriAdmin>) => {
  const res = await fetch(`${API_URL}/admin/santri/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update santri');
  return await res.json();
};

export const deleteSantri = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/santri/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete santri');
  return await res.json();
};

// 3. Users CRUD
export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
};

export const saveUser = async (data: Partial<UserAdmin>) => {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save user');
  return await res.json();
};

export const updateUser = async (id: string, data: Partial<UserAdmin>) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return await res.json();
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
};

export const resetUserPassword = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ password: 'mubtadiaat123' })
  });
  if (!res.ok) throw new Error('Failed to reset user password');
  return await res.json();
};

// 4. Audit Logs
export const fetchAuditLogs = async () => {
  const res = await fetch(`${API_URL}/admin/logs`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return await res.json();
};

// 5. Google Sheets Sync
export const syncGoogleSheets = async (action: 'IMPORT' | 'EXPORT', sheetUrl: string) => {
  const res = await fetch(`${API_URL}/admin/sync/sheets`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ action, sheetUrl })
  });
  if (!res.ok) throw new Error('Failed to sync google sheets');
  return await res.json();
};

// 6. Region API (Using Vite Proxy to emsifa API)
const WILAYAH_API = '/api-wilayah';

export const fetchProvinces = async () => {
  try {
    const res = await fetch(`${WILAYAH_API}/provinces.json`);
    if (!res.ok) throw new Error('API failed');
    return { success: true, data: await res.json() };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const fetchRegencies = async (provinceId: string) => {
  if (!provinceId) return { success: true, data: [] };
  try {
    const res = await fetch(`${WILAYAH_API}/regencies/${provinceId}.json`);
    if (!res.ok) throw new Error('API failed');
    return { success: true, data: await res.json() };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const fetchDistricts = async (regencyId: string) => {
  if (!regencyId) return { success: true, data: [] };
  try {
    const res = await fetch(`${WILAYAH_API}/districts/${regencyId}.json`);
    if (!res.ok) throw new Error('API failed');
    return { success: true, data: await res.json() };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const fetchVillages = async (districtId: string) => {
  if (!districtId) return { success: true, data: [] };
  try {
    const res = await fetch(`${WILAYAH_API}/villages/${districtId}.json`);
    if (!res.ok) throw new Error('API failed');
    return { success: true, data: await res.json() };
  } catch (err) {
    return { success: false, data: [] };
  }
};

// 7. Jadwal Pelajaran
export const fetchJadwal = async () => {
  const res = await fetch(`${API_URL}/admin/akademik/jadwal`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch jadwal');
  return await res.json();
};

export const saveJadwal = async (data: any) => {
  const res = await fetch(`${API_URL}/admin/akademik/jadwal`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save jadwal');
  return await res.json();
};

export const updateJadwal = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/admin/akademik/jadwal/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update jadwal');
  return await res.json();
};

export const deleteJadwal = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/akademik/jadwal/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete jadwal');
  return await res.json();
};

// 8. E-Rapot
export const fetchRapotSemester = async () => {
  const res = await fetch(`${API_URL}/admin/akademik/rapot`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch rapot semester');
  return await res.json();
};

export const saveRapotSemester = async (data: any) => {
  const res = await fetch(`${API_URL}/admin/akademik/rapot`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save rapot semester');
  return await res.json();
};

export const updateRapotSemester = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/admin/akademik/rapot/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update rapot semester');
  return await res.json();
};

export const deleteRapotSemester = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/akademik/rapot/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete rapot semester');
  return await res.json();
};

export const finalisasiRapot = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/akademik/rapot/${id}/finalisasi`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to finalisasi rapot');
  return await res.json();
};

export const unlockRapot = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/akademik/rapot/${id}/unlock`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to unlock rapot');
  return await res.json();
};
