import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './cache/queryClient';
import { AdminLayout } from './layouts/AdminLayout';
import { GuruLayout } from './layouts/GuruLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { useSession } from './lib/auth.client';
import { NotificationRenderer } from './components/ui';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSantriPage } from './pages/AdminSantriPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminLogsPage } from './pages/AdminLogsPage';
import { AdminBlokKamarPage } from './pages/AdminBlokKamarPage';
import { AdminJadwalPage } from './pages/AdminJadwalPage';
import { AdminRapotPage } from './pages/AdminRapotPage';

// New Master Pages
import { AdminJenjangPage } from './pages/master/AdminJenjangPage';
import { AdminTingkatPage } from './pages/master/AdminTingkatPage';
import { AdminKelasRombelPage } from './pages/master/AdminKelasRombelPage';
import { AdminKitabPage } from './pages/master/AdminKitabPage';
import { AdminAsatidzPage } from './pages/master/AdminAsatidzPage';

import { AdminTahunAjaranPage } from './pages/AdminTahunAjaranPage';
import { AdminKelulusanPage } from './pages/AdminKelulusanPage';
import { PrintKelulusanPage } from './pages/PrintKelulusanPage';

// Guru Pages
import { GuruDashboard } from './pages/guru/GuruDashboard';
import { GuruPresensi } from './pages/guru/GuruPresensi';
import { GuruPenilaian } from './pages/guru/GuruPenilaian';
import { GuruRekap } from './pages/guru/GuruRekap';
import { GuruFinalisasi } from './pages/guru/GuruFinalisasi';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: number[] }) => {
  const { data: session, isPending, error } = useSession();
  
  if (isPending) return <div>Memuat sesi...</div>;

  let user = session?.user as any;
  
  // Offline fallback
  if (!user && (error || !navigator.onLine)) {
    const cached = localStorage.getItem("better-auth.cached_user");
    if (cached) {
      try {
        user = JSON.parse(cached);
      } catch (e) {}
    }
  }

  // Role 1 = Admin, 2 = Mundzir, 3 = Mufatish, 4 = Mustahiq
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

import { useEffect } from 'react';
import { useSettingsStore } from './stores/useSettingsStore';

function App() {
  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationRenderer />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/print/kelulusan/:type" element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <PrintKelulusanPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routing (Role 1) */}
          <Route element={<ProtectedRoute allowedRoles={[1]}><AdminLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/santri" element={<AdminSantriPage />} />
            
            {/* Master Pages */}
            <Route path="/jenjang" element={<AdminJenjangPage />} />
            <Route path="/tingkat" element={<AdminTingkatPage />} />
            <Route path="/kelas-rombel" element={<AdminKelasRombelPage />} />
            <Route path="/kitab" element={<AdminKitabPage />} />
            <Route path="/asatidz" element={<AdminAsatidzPage />} />

            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/logs" element={<AdminLogsPage />} />
            <Route path="/blok-kamar" element={<AdminBlokKamarPage />} />
            <Route path="/jadwal" element={<AdminJadwalPage />} />
            <Route path="/rapot" element={<AdminRapotPage />} />
            <Route path="/kelulusan" element={<AdminKelulusanPage />} />
            <Route path="/tahun-ajaran" element={<AdminTahunAjaranPage />} />
            <Route path="/*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Guru Routing (Role 2, 3, 4) */}
          <Route element={<ProtectedRoute allowedRoles={[2, 3, 4]}><GuruLayout /></ProtectedRoute>}>
            {/* Common */}
            <Route path="/guru/dashboard" element={<GuruDashboard />} />
            
            {/* Mustahiq Only */}
            <Route path="/guru/presensi" element={<GuruPresensi />} />
            <Route path="/guru/penilaian" element={<GuruPenilaian />} />
            
            {/* Monitoring Only */}
            <Route path="/guru/rekap" element={<GuruRekap />} />
            <Route path="/guru/finalisasi" element={<GuruFinalisasi />} />

            <Route path="/guru/*" element={<Navigate to="/guru/dashboard" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
