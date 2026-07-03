/**
 * wilayah.service.ts
 * Layanan untuk mengambil data wilayah Indonesia secara cascading
 * menggunakan API publik: https://emsifa.github.io/api-wilayah-indonesia/
 *
 * API Endpoints:
 *   Provinces     → /api/provinces.json
 *   Regencies     → /api/regencies/{province_id}.json
 *   Districts     → /api/districts/{regency_id}.json
 *   Villages      → /api/villages/{district_id}.json
 */

const BASE_URL = 'https://emsifa.github.io/api-wilayah-indonesia/api';

export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface District {
  id: string;
  regency_id: string;
  name: string;
}

export interface Village {
  id: string;
  district_id: string;
  name: string;
}

// Simple in-memory cache to avoid repeated fetches
const cache = new Map<string, any>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal mengambil data wilayah: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data as T;
}

export const wilayahService = {
  /** Ambil seluruh provinsi Indonesia */
  getProvinces(): Promise<Province[]> {
    return fetchWithCache<Province[]>(`${BASE_URL}/provinces.json`);
  },

  /** Ambil kabupaten/kota berdasarkan ID provinsi */
  getRegencies(provinceId: string): Promise<Regency[]> {
    return fetchWithCache<Regency[]>(`${BASE_URL}/regencies/${provinceId}.json`);
  },

  /** Ambil kecamatan berdasarkan ID kabupaten/kota */
  getDistricts(regencyId: string): Promise<District[]> {
    return fetchWithCache<District[]>(`${BASE_URL}/districts/${regencyId}.json`);
  },

  /** Ambil kelurahan/desa berdasarkan ID kecamatan */
  getVillages(districtId: string): Promise<Village[]> {
    return fetchWithCache<Village[]>(`${BASE_URL}/villages/${districtId}.json`);
  },
};
