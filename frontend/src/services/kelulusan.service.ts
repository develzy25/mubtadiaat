const API_URL = import.meta.env.VITE_API_URL || 'https://mubtadiat-db.eppds.workers.dev';

const getHeaders = () => {
  const token = localStorage.getItem('better-auth.session_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const kelulusanService = {
  getSertifikat: async (kelasId: string, academicYear: string) => {
    const res = await fetch(`${API_URL}/api/kelulusan/sertifikat?kelasId=${kelasId}&academicYear=${academicYear}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch sertifikat data');
    const data = await res.json();
    return data.data;
  },
  
  getIjazah: async (kelasId: string, academicYear: string) => {
    const res = await fetch(`${API_URL}/api/kelulusan/ijazah?kelasId=${kelasId}&academicYear=${academicYear}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch ijazah data');
    const data = await res.json();
    return data.data;
  }
};
