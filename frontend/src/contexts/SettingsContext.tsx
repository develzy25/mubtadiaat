import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export interface GlobalSettings {
  activeAcademicYear: string;
}

interface SettingsContextType {
  settings: GlobalSettings;
  isLoading: boolean;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['globalSettings'],
    queryFn: async () => {
      // In a real app we fetch this from /api/settings
      // For now we will fallback to a default or fetch if the route is implemented.
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return json.data as GlobalSettings;
          }
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      }
      return { activeAcademicYear: '2026-2027' };
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  return (
    <SettingsContext.Provider 
      value={{ 
        settings: data || { activeAcademicYear: '2026-2027' }, 
        isLoading, 
        refreshSettings: refetch 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
