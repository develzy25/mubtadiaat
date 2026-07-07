import { Search, Bell, UserCircle, Calendar, Wifi, WifiOff, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

export function Topbar() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  

  const { activeAcademicYear, fetchSettings, updateAcademicYear, isLoading } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
    // Online/Offline detection
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clock ticker
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <header className="h-20 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-slate-100 flex items-center justify-between px-8 z-10 w-full shrink-0">
      <div className="flex-1 max-w-md relative group">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text"
          placeholder="Cari data santri, kelas, laporan..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        {/* Info Box: Global Settings (Academic Year) */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl relative group cursor-pointer transition-colors hover:bg-blue-100">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Tahun Ajaran</span>
            <select 
              className="text-xs font-bold text-blue-900 bg-transparent outline-none cursor-pointer border-none p-0 focus:ring-0"
              value={activeAcademicYear}
              disabled={isLoading}
              onChange={(e) => updateAcademicYear(e.target.value)}
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
            </select>
          </div>
        </div>

        {/* Info Box: Date & Time */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-700">{formatDate(currentTime)}</span>
          </div>
        </div>

        {/* Info Box: Online/Offline Status */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${isOnline ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-600" />
          )}
          <span className={`text-xs font-bold ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800">Admin Utama</p>
            <p className="text-xs text-slate-500 font-medium">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
             {/* Account placeholder logo */}
             <UserCircle className="w-7 h-7 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
