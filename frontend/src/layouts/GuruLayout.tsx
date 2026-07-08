import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useOutlet } from 'react-router';
import { 
  CalendarCheck, 
  FileSpreadsheet, 
  Activity, 
  LogOut,
  FileCheck2,
  Menu,
  X,
  Clock,
  UserCircle,
  Home,
  BookOpen,
  Eye
} from 'lucide-react';
import { useSession, signOut } from '../lib/auth.client';
import { motion, AnimatePresence } from 'framer-motion';
import { OfflineSyncManager } from '../components/OfflineSyncManager';

export const GuruLayout = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { data: sessionData } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();

  const role = (sessionData?.user as any)?.role || 4;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatDateTime = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} • ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  // Define Nav items based on role
  const getNavItems = () => {
    const items = [
      { name: 'Beranda', path: '/guru/dashboard', icon: <Home className="w-5 h-5" /> },
    ];

    if (role === 4) {
      // Mustahiq
      items.push({ name: 'Presensi Siswa', path: '/guru/presensi', icon: <CalendarCheck className="w-5 h-5" /> });
      items.push({ name: 'Input Nilai', path: '/guru/penilaian', icon: <FileSpreadsheet className="w-5 h-5" /> });
      items.push({ name: 'Jadwal Mengajar', path: '/guru/jadwal', icon: <BookOpen className="w-5 h-5" /> });
    } else if (role === 2) {
      // Mundzir
      items.push({ name: 'Laporan Rekap', path: '/guru/rekap', icon: <Activity className="w-5 h-5" /> });
      items.push({ name: 'Monitor Kelas', path: '/guru/monitor', icon: <Eye className="w-5 h-5" /> });
      items.push({ name: 'Finalisasi Nilai', path: '/guru/finalisasi', icon: <FileCheck2 className="w-5 h-5" /> });
    } else if (role === 3) {
      // Mufatish
      items.push({ name: 'Laporan Rekap', path: '/guru/rekap', icon: <Activity className="w-5 h-5" /> });
      items.push({ name: 'Progres Penilaian', path: '/guru/progres', icon: <FileSpreadsheet className="w-5 h-5" /> });
      items.push({ name: 'Finalisasi Nilai', path: '/guru/finalisasi', icon: <FileCheck2 className="w-5 h-5" /> });
    }

    return items;
  };

  const navItems = getNavItems();

  const getPortalTitle = () => {
    if (role === 2) return 'Portal Mundzir';
    if (role === 3) return 'Portal Mufatish';
    return 'Portal Pengajar';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-[20px_0_40px_rgba(0,0,0,0.15)] border-r border-slate-700/50 md:translate-x-0 md:static md:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header (Logo) */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-sky-600/10 to-transparent pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 relative z-10"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)]">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white drop-shadow-md">e-Mubtadi'aat</h1>
              <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest mt-0.5">{getPortalTitle()}</p>
            </div>
          </motion.div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar relative">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                key={item.path} 
                className="mb-1"
              >
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
                    isActive ? 'text-white font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavBubbleGuru"
                      className="absolute inset-0 bg-linear-to-r from-sky-500 to-sky-600 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3),inset_0_2px_4px_rgba(255,255,255,0.2)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {!isActive && (
                    <div className="absolute inset-0 bg-slate-800/0 group-hover:bg-slate-800/80 rounded-xl transition-colors duration-300" />
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>
                      {item.icon}
                    </span>
                    <span className="tracking-wide">{item.name}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Modern Header */}
        <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex items-center justify-between shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.02)] z-40 relative">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase hidden md:block">
              {navItems.find(item => location.pathname === item.path)?.name || 'Dasbor Pengajar'}
            </h2>
          </div>

          {/* Right Area: Time, Status, User */}
          <div className="flex items-center gap-5">
            
            {/* Realtime Clock */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-xl border border-white shadow-inner">
              <Clock className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-black text-slate-600 tracking-wide">
                {formatDateTime(currentTime)}
              </span>
            </div>

            {/* Online Status */}
            <div className={`flex items-center gap-2 px-3 py-2 border rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,1)] ${isOnline ? 'bg-emerald-50 border-emerald-100/50' : 'bg-amber-50 border-amber-100/50'}`}>
              <span className="relative flex h-3 w-3">
                {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-sky-600 transition-colors">
                  {sessionData?.user?.name || 'Mustahiq'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {getPortalTitle()}
                </p>
              </div>
              
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-sky-400 to-sky-600 p-[2px] shadow-[0_4px_10px_rgba(14,165,233,0.3)] transform transition-transform group-hover:scale-105 group-active:scale-95">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-transparent overflow-hidden">
                    <UserCircle className="w-full h-full text-sky-600 bg-sky-50" />
                  </div>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Keluar Sistem"
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-md border border-slate-100 hover:bg-rose-50 hover:scale-110 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* View Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-sky-50/20 to-transparent pointer-events-none -z-10" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="h-full"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <OfflineSyncManager />
    </div>
  );
};
