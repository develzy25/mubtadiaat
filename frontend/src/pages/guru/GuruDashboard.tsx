import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { 
  Users, BookOpen, ClipboardList, Star,
  Calendar, CheckSquare, Activity
} from 'lucide-react';
import { useSession } from '../../lib/auth.client';
import { fetchDashboardData } from '../../services/guru.service';

export const GuruDashboard = () => {
  const { data: sessionData, isPending: sessionPending } = useSession();
  const roleId = (sessionData?.user as any)?.role || 4; // default to 4 (Mustahiq)
  const isMonitoring = roleId === 2 || roleId === 3;
  const userName = sessionData?.user?.name || "Ustadz/Ustadzah";
  const roleName = roleId === 2 ? 'mundzir' : roleId === 3 ? 'mufatish' : 'mustahiq';

  const { data, isLoading } = useQuery({
    queryKey: ['guruDashboard', roleName],
    queryFn: () => fetchDashboardData(roleName),
    enabled: !!sessionData
  });

  if (sessionPending || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Neumorphic shadow class for Tailwind
  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="pt-2">
        <p className="text-slate-800 text-sm font-semibold tracking-wide">Pondok Pesantren</p>
        <h1 className="text-slate-900 text-2xl md:text-3xl font-extrabold tracking-tight mt-1 leading-tight">Hidayatul Mubtadi'at</h1>
        <h2 className="text-slate-900 text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">Lirboyo</h2>
        <p className="text-slate-500 text-xs font-medium mt-2">Aplikasi Pengajar</p>
      </div>

      {/* PROFILE CARD */}
      <div className={`${neumorphicShadow} rounded-[32px] p-6 flex flex-row items-center justify-between`}>
        <div className="flex flex-row items-center flex-1 pr-2">
          <div className="flex-1">
            <p className="text-slate-500 text-xs font-medium mb-0.5">Assalamu'alaikum,</p>
            <p className="text-slate-800 text-lg font-extrabold">{userName}</p>
            <p className="text-slate-400 text-[10px] leading-tight mt-1 font-medium pr-4">Semoga hari ini penuh keberkahan dalam mengajar dan membimbing.</p>
          </div>
        </div>

        {/* 3D Calendar Widget Placeholder */}
        <div className="flex items-center bg-slate-50 rounded-[20px] p-3 border border-slate-100 shadow-sm shrink-0">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* RINGKASAN HARI INI */}
      <div>
        <h3 className="text-slate-800 font-bold text-lg mb-4">Ringkasan Hari Ini</h3>
        <div className="grid grid-cols-4 gap-3">
          {isMonitoring ? (
            <>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
                  <BookOpen className="text-blue-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Total Kelas</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.totalKelas}</p>
              </div>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
                  <Users className="text-emerald-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Total Santri</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.totalSantri}</p>
              </div>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-2">
                  <CheckSquare className="text-amber-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Guru Aktif</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.guruAktif}</p>
              </div>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-2">
                  <Star className="text-purple-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Laporan</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.laporan}</p>
              </div>
            </>
          ) : (
            <>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
                  <Users className="text-blue-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Kelas Saya</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.kelas}</p>
              </div>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
                  <BookOpen className="text-emerald-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Jadwal</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.jadwal}</p>
              </div>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-2">
                  <CheckSquare className="text-amber-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Tugas</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.tugas}</p>
              </div>
              <div className={`${neumorphicShadow} rounded-3xl p-3 flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-2">
                  <Star className="text-purple-500 w-5 h-5" />
                </div>
                <p className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Penilaian</p>
                <p className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.penilaian}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* JADWAL MENGAJAR & TUGAS (Hanya Mustahiq) */}
      {!isMonitoring && (
        <>
          <div>
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-slate-800 font-bold text-lg">Jadwal Mengajar Hari Ini</h3>
              <button className="text-blue-500 text-xs font-semibold">Lihat Semua &gt;</button>
            </div>

            <div className={`${neumorphicShadow} rounded-[28px] p-5`}>
              
              {/* Item 1 */}
              <div className="flex flex-row mb-6 relative">
                <div className="w-14 flex flex-col items-center mr-2 shrink-0">
                  <p className="text-slate-800 font-bold text-sm">07:30</p>
                  <p className="text-slate-400 text-xs font-medium">08:30</p>
                </div>
                {/* Timeline Line */}
                <div className="w-px h-full bg-slate-200 absolute left-[64px] top-4 -z-10" />
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-2 mr-4 shrink-0" />
                
                <div className="flex-1 flex flex-row">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-sm shadow-blue-500/30 mr-3 shrink-0">
                    <BookOpen className="text-white w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-extrabold text-sm mb-0.5">Kelas Tahsin</p>
                    <p className="text-blue-600 text-xs font-bold mb-1">Kelas A</p>
                    <p className="text-slate-400 text-[10px] font-medium">Materi: Makharijul Huruf</p>
                  </div>
                  <div className="bg-emerald-50 px-2 py-1 h-6 rounded-lg self-start">
                    <p className="text-emerald-600 text-[9px] font-bold">Sedang Berlangsung</p>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-row relative">
                <div className="w-14 flex flex-col items-center mr-2 shrink-0">
                  <p className="text-slate-800 font-bold text-sm">09:00</p>
                  <p className="text-slate-400 text-xs font-medium">10:00</p>
                </div>
                <div className="w-px h-full bg-slate-200 absolute left-[64px] top-4 -z-10" />
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 ml-2 mr-4 shrink-0" />
                
                <div className="flex-1 flex flex-row opacity-60 grayscale">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-sm shadow-blue-500/30 mr-3 shrink-0">
                    <ClipboardList className="text-white w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-extrabold text-sm mb-0.5">Fiqih Dasar</p>
                    <p className="text-blue-600 text-xs font-bold mb-1">Kelas B</p>
                    <p className="text-slate-400 text-[10px] font-medium">Materi: Thaharah</p>
                  </div>
                  <div className="bg-slate-100 px-2 py-1 h-6 rounded-lg self-start">
                    <p className="text-slate-500 text-[9px] font-bold">Akan Datang</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </>
      )}

      {/* AKSES CEPAT */}
      <div>
        <h3 className="text-slate-800 font-bold text-lg mb-4">Akses Cepat</h3>
        
        <div className="flex flex-row overflow-x-auto pb-4 gap-3 snap-x">
          {(isMonitoring ? [
            { title: 'Rekap Presensi', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', link: '/guru/rekap' },
            { title: 'Laporan Kelas', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50', link: '#' },
            { title: 'Data Asatidz', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '#' },
            { title: 'Jadwal Pesantren', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', link: '#' }
          ] : [
            { title: 'Kelas Saya', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', link: '/guru/presensi' },
            { title: 'Input Nilai', icon: ClipboardList, color: 'text-purple-500', bg: 'bg-purple-50', link: '/guru/penilaian' },
            { title: 'Penilaian', icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-50', link: '#' },
            { title: 'Jadwal Saya', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', link: '#' }
          ]).map((item, index) => {
            const Card = (
              <div key={index} className={`${neumorphicShadow} rounded-3xl w-[85px] p-3 flex flex-col items-center shrink-0 snap-start`}>
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-2 shadow-sm border border-white`}>
                  <item.icon className={`${item.color} w-6 h-6`} />
                </div>
                <p className="text-slate-600 text-[10px] font-bold text-center leading-tight">{item.title}</p>
              </div>
            );

            if (item.link !== '#') {
              return (
                <Link key={index} to={item.link}>
                  {Card}
                </Link>
              );
            }
            return Card;
          })}
        </div>
      </div>

    </div>
  );
};
