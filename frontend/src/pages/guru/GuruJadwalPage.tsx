import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, AlertCircle } from 'lucide-react';
import { fetchJadwalMengajar } from '../../services/guru.service';
import { GlassCard } from '../../components/ui';

export const GuruJadwalPage = () => {
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJadwal = async () => {
      try {
        const res = await fetchJadwalMengajar();
        if (res?.success) {
          setJadwal(res.data);
        } else {
          setError(res?.message || 'Gagal memuat jadwal mengajar.');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat jadwal.');
      } finally {
        setLoading(false);
      }
    };
    loadJadwal();
  }, []);

  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <div className={`${neumorphicShadow} rounded-b-[32px] px-6 pt-6 pb-6 z-10 mb-6 -mx-4 md:mx-0 md:rounded-[32px] md:mt-2`}>
        <p className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Mustahiq</p>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Jadwal Mengajar Anda</h1>
        <p className="text-slate-500 font-semibold mt-1">Daftar mata pelajaran yang diampu</p>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center mt-20">
             <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Oops!</h2>
             <p className="text-slate-500 text-center">{error}</p>
          </div>
        ) : jadwal.length === 0 ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <BookOpen className="text-blue-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Jadwal</h2>
             <p className="text-slate-500 text-center">Anda belum dijadwalkan mengajar pada semester aktif ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jadwal.map((j) => (
              <GlassCard key={j.id} className="p-5 flex flex-col justify-between border-white/50 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                <div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-lg uppercase tracking-wide">
                    {j.kelas || 'Kelas'}
                  </span>
                  <h3 className="text-slate-800 font-extrabold text-base mt-3 leading-snug">{j.kit || j.kitab || 'Mata Pelajaran'}</h3>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-100 text-slate-400 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{j.hari || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{j.sesi || '-'}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
