import { create } from 'zustand';

interface SettingsState {
  activeAcademicYear: string;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateAcademicYear: (year: string) => Promise<void>;
}

const API_BASE_URL = 'https://mubtadiat-db.eppds.workers.dev/api';

export const useSettingsStore = create<SettingsState>((set) => ({
  activeAcademicYear: '2026-2027',
  isLoading: false,
  
  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("better-auth.session_token");
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/admin/settings`, { headers });
      const data = await res.json();
      if (data.success && data.data) {
        set({ activeAcademicYear: data.data.activeAcademicYear });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateAcademicYear: async (year: string) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("better-auth.session_token");
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ activeAcademicYear: year })
      });
      const data = await res.json();
      if (data.success) {
        set({ activeAcademicYear: year });
      }
    } catch (error) {
      console.error('Failed to update academic year:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
