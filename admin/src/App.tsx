import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './cache/queryClient';
import { AdminLayout } from './layouts/AdminLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { useSession } from './lib/auth.client';

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

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: number[] }) => {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Memuat sesi...</div>;

  const user = session?.user as any;
  // Role 1 = Admin, 2 = Mundzir, 3 = Mufatish, 4 = Mustahiq
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
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
            <Route path="/*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
