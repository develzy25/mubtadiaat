import { useState, useEffect } from 'react';
import { Activity, Check, X, AlertCircle, Clock } from 'lucide-react';
import { fetchRekapPresensi } from '../../services/guru.service';

export const GuruRekap = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchRekapPresensi();
        if (res?.success) {
          setData(res.data);
        } else {
          setError(res?.message || 'Gagal memuat rekap');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data rekap.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[350px] h-[350px] bg-indigo-300/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className={`${neumorphicShadow} rounded-b-[32px] px-6 pt-6 pb-6 z-10 mb-6 -mx-4 md:mx-0 md:rounded-[32px] md:mt-2`}>
        <p className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Laporan Mufatish</p>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rekap Presensi</h1>
        <p className="text-slate-500 font-semibold mt-1">Tahun Ajaran Aktif</p>
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
        ) : !data ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <Activity className="text-blue-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Rekap</h2>
             <p className="text-slate-500 text-center">Data rekap presensi belum tersedia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between gap-4">
              <div className={`${neumorphicShadow} rounded-[24px] w-[48%] p-5 flex flex-col items-center`}>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <Check className="text-blue-600 w-6 h-6" />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Hadir</p>
                <p className="text-slate-800 text-3xl font-black">{data.totalHadir}</p>
              </div>

              <div className={`${neumorphicShadow} rounded-[24px] w-[48%] p-5 flex flex-col items-center`}>
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
                  <Clock className="text-indigo-600 w-6 h-6" />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Izin</p>
                <p className="text-slate-800 text-3xl font-black">{data.totalIzin}</p>
              </div>
            </div>

            <div className="flex flex-row justify-between gap-4">
              <div className={`${neumorphicShadow} rounded-[24px] w-[48%] p-5 flex flex-col items-center`}>
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                  <AlertCircle className="text-amber-500 w-6 h-6" />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Sakit</p>
                <p className="text-slate-800 text-3xl font-black">{data.totalSakit}</p>
              </div>

              <div className={`${neumorphicShadow} rounded-[24px] w-[48%] p-5 flex flex-col items-center`}>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                  <X className="text-red-500 w-6 h-6" />
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Alpha</p>
                <p className="text-slate-800 text-3xl font-black">{data.totalAlpha}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
