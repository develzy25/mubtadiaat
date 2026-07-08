import { useState, useEffect } from 'react';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { fetchStatusKelas } from '../../services/guru.service';

export const GuruProgresPenilaian = () => {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchStatusKelas();
        if (res?.success) {
          setKelasList(res.data);
        } else {
          setError(res?.message || 'Gagal memuat progres penilaian kelas.');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data progres.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <div className={`${neumorphicShadow} rounded-b-[32px] px-6 pt-6 pb-6 z-10 mb-6 -mx-4 md:mx-0 md:rounded-[32px] md:mt-2`}>
        <p className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest mb-1">Mufatish</p>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Progres Penilaian Kelas</h1>
        <p className="text-slate-500 font-semibold mt-1">Daftar rekap kelengkapan nilai per rombel</p>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center mt-20">
             <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Oops!</h2>
             <p className="text-slate-500 text-center">{error}</p>
          </div>
        ) : kelasList.length === 0 ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet className="text-emerald-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Data</h2>
             <p className="text-slate-500 text-center">Data kelas belum tersedia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {kelasList.map((k) => (
              <div key={k.id} className={`${neumorphicShadow} rounded-[24px] p-5 flex flex-col gap-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-800 font-extrabold text-lg">{k.name}</h3>
                    <p className="text-slate-400 font-semibold text-xs mt-1">Mustahiq (Wali): <span className="text-slate-600 font-bold">{k.wali}</span></p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    k.status === 'SUDAH FINAL' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : k.status === 'Siap Finalisasi'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {k.status}
                  </span>
                </div>
                
                <div className="w-full pt-2 border-t border-slate-50">
                  <div className="flex justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span>Input Nilai Santri</span>
                    <span>{k.progress}% Selesai</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${k.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
