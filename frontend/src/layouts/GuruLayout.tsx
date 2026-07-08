import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useOutlet } from 'react-router';
import { 
  Home, 
  CalendarCheck, 
  FileSpreadsheet, 
  Activity, 
  LogOut,
  FileCheck2
} from 'lucide-react';
import { useSession, signOut } from '../lib/auth.client';
import { motion, AnimatePresence } from 'framer-motion';
import { OfflineSyncManager } from '../components/OfflineSyncManager';

export const GuruLayout = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const { data: sessionData } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();

  const role = (sessionData?.user as any)?.role || 4;
  const isMonitoring = role === 2 || role === 3; // Mundzir & Mufatish

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Define Bottom Nav items based on role
  const getNavItems = () => {
    const items = [
      { name: 'Beranda', path: '/guru/dashboard', icon: <Home className="w-5 h-5" /> },
    ];

    if (!isMonitoring) {
      // Mustahiq (Role 4)
      items.push({ name: 'Absensi', path: '/guru/presensi', icon: <CalendarCheck className="w-5 h-5" /> });
      items.push({ name: 'Nilai', path: '/guru/penilaian', icon: <FileSpreadsheet className="w-5 h-5" /> });
    } else {
      // Mundzir & Mufatish (Role 2 & 3)
      items.push({ name: 'Laporan', path: '/guru/rekap', icon: <Activity className="w-5 h-5" /> });
      items.push({ name: 'Finalisasi', path: '/guru/finalisasi', icon: <FileCheck2 className="w-5 h-5" /> });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Top Header Mobile Style */}
      <header className="bg-white px-5 py-4 flex items-center justify-between shadow-sm z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center p-1 shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-800">e-Mubtadi'aat</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">
              Portal {role === 2 ? 'Mundzir' : role === 3 ? 'Mufatish' : 'Mustahiq'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-xs font-bold text-slate-800">{sessionData?.user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-rose-500 shadow-sm border border-slate-100 hover:bg-rose-50 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="h-full p-4 md:p-6 max-w-5xl mx-auto"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar (Glassmorphism + iOS Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-3xl p-2 flex items-center justify-around w-full max-w-md pointer-events-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-16 h-14 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavBubble"
                    className="absolute inset-0 bg-blue-50 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className={`mb-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-400'}`}
                >
                  {item.icon}
                </motion.div>
                <span className={`text-[9px] font-bold tracking-wide transition-colors ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <OfflineSyncManager />
    </div>
  );
};
