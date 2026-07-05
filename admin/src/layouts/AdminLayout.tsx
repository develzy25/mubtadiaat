import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Users2, 
  UserCog, 
  History, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Building2,
  Search,
  Clock,
  ChevronRight,
  Layers,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  UserCircle
} from 'lucide-react';
import { useSession, signOut } from '../lib/auth.client';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string>('akademik');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);
  
  const { data: sessionData } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  type NavChild = { name: string; path: string; icon: React.ReactNode; };
  type NavItem = {
    name: string;
    path?: string;
    icon: React.ReactNode;
    groupKey?: string;
    children?: NavChild[];
  };

  const navItems: NavItem[] = [
    {
      name: 'Dasbor Eksekutif',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Kesiswaan',
      icon: <Users2 className="w-5 h-5" />,
      groupKey: 'kesiswaan',
      children: [
        { name: 'Data Santri', path: '/santri', icon: <Users2 className="w-4 h-4" /> },
        { name: 'Blok & Kamar', path: '/blok-kamar', icon: <Building2 className="w-4 h-4" /> },
      ],
    },
    {
      name: 'Kurikulum & Akademik',
      icon: <BookOpen className="w-5 h-5" />,
      groupKey: 'akademik',
      children: [
        { name: 'Master Jenjang', path: '/jenjang', icon: <Layers className="w-4 h-4" /> },
        { name: 'Master Tingkat', path: '/tingkat', icon: <GraduationCap className="w-4 h-4" /> },
        { name: 'Master Kelas (Rombel)', path: '/kelas-rombel', icon: <Building2 className="w-4 h-4" /> },
        { name: 'Master Kitab', path: '/kitab', icon: <BookOpen className="w-4 h-4" /> },
        { name: 'Jadwal Pelajaran', path: '/jadwal', icon: <Calendar className="w-4 h-4" /> },
        { name: 'E-Rapot', path: '/rapot', icon: <FileSpreadsheet className="w-4 h-4" /> }
      ]
    },
    {
      name: 'Pengaturan Sistem',
      icon: <UserCog className="w-5 h-5" />,
      groupKey: 'sistem',
      children: [
        { name: 'Master Pengurus', path: '/asatidz', icon: <UserCircle className="w-4 h-4" /> },
        { name: 'Akses & Pengguna', path: '/users', icon: <UserCog className="w-4 h-4" /> },
        { name: 'Catatan Audit', path: '/logs', icon: <History className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-[20px_0_40px_rgba(0,0,0,0.15)] border-r border-slate-700/50 md:translate-x-0 md:static md:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header (Logo) */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent pointer-events-none" />
          
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
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-0.5">Portal Admin Web</p>
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
            const hasChildren = item.children && item.children.length > 0;
            const isGroupOpen = item.groupKey ? expandedGroup === item.groupKey : false;
            const isChildActive = hasChildren && item.children!.some(c => location.pathname === c.path);

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                key={item.path || item.name} 
                className="mb-1"
              >
                <div className="flex items-center gap-1">
                  <Link
                    to={item.path || '#'}
                    onClick={(e) => {
                      if (!item.path && item.children) {
                        e.preventDefault();
                        setExpandedGroup(isGroupOpen ? '' : (item.groupKey || ''));
                      } else {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
                      (isActive || isChildActive)
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {(isActive || isChildActive) && (
                      <motion.div 
                        layoutId="activeNavBubble"
                        className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3),inset_0_2px_4px_rgba(255,255,255,0.2)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {!(isActive || isChildActive) && (
                      <div className="absolute inset-0 bg-slate-800/0 group-hover:bg-slate-800/80 rounded-xl transition-colors duration-300" />
                    )}

                    <div className="relative z-10 flex items-center gap-3">
                      {item.icon}
                      <span className="tracking-wide">{item.name}</span>
                    </div>
                  </Link>
                  
                  {hasChildren && (
                    <button
                      onClick={() => setExpandedGroup(isGroupOpen ? '' : (item.groupKey || ''))}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-hidden"
                    >
                      <motion.div animate={{ rotate: isGroupOpen ? 90 : 0 }}>
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                  )}
                </div>

                {/* Sub-menu children */}
                <AnimatePresence>
                  {hasChildren && isGroupOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 mt-2 space-y-1 border-l border-slate-700/50 pl-4 py-1">
                        {item.children!.map((child) => {
                          const isChildItemActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 relative group overflow-hidden ${
                                isChildItemActive
                                  ? 'text-blue-300'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {isChildItemActive && (
                                <motion.div 
                                  layoutId="activeChildBubble"
                                  className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                                />
                              )}
                              
                              <div className="relative z-10 flex items-center gap-3">
                                <motion.div 
                                  whileHover={{ scale: 1.2, rotate: 5 }}
                                  className={isChildItemActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}
                                >
                                  {child.icon}
                                </motion.div>
                                <span className="tracking-wide">{child.name}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Modern 3D Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 px-6 py-4 flex items-center justify-between shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-40 relative">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase hidden md:block">
              {(() => {
                const topLevel = navItems.find(item => location.pathname === item.path);
                if (topLevel) return topLevel.name;
                for (const item of navItems) {
                  if (item.children) {
                    const child = item.children.find(c => location.pathname === c.path);
                    if (child) return child.name;
                  }
                }
                return 'Dashboard Eksekutif';
              })()}
            </h2>
          </div>

          {/* Center: Global Search Bar 3D */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <motion.div 
              animate={{
                boxShadow: searchFocused 
                  ? '0 10px 25px -5px rgba(79, 70, 229, 0.2), 0 8px 10px -6px rgba(79, 70, 229, 0.1), inset 0 2px 4px rgba(255,255,255,0.8)' 
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255,255,255,0.8)'
              }}
              className="relative w-full bg-slate-50/50 backdrop-blur-md border border-white/60 rounded-full overflow-hidden transition-colors duration-300 hover:bg-white"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Cari santri, kelas, data master..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-11 pl-11 pr-4 bg-transparent outline-hidden text-sm font-bold text-slate-700 placeholder-slate-400"
              />
            </motion.div>
          </div>

          {/* Right: Date/Time, Online Status, User Profile */}
          <div className="flex items-center gap-5">
            
            {/* Realtime Clock */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-xl border border-white shadow-inner">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-black text-slate-600 tracking-wide">
                {formatDateTime(currentTime)}
              </span>
            </div>

            {/* Online Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100/50 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 hidden sm:block">
                Online
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {sessionData?.user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {sessionData?.user?.email || 'admin@mubtadiaat.id'}
                </p>
              </div>
              
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 p-[2px] shadow-[0_4px_10px_rgba(79,70,229,0.3)] transform transition-transform group-hover:scale-105 group-active:scale-95">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-transparent overflow-hidden">
                    <UserCircle className="w-full h-full text-indigo-600 bg-indigo-50" />
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
          <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-indigo-50/50 to-transparent pointer-events-none -z-10" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
