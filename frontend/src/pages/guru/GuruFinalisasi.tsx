import { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { fetchStatusKelas, submitFinalisasiKelas } from '../../services/guru.service';

export const GuruFinalisasi = () => {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchStatusKelas();
      if (res?.success) {
        setKelasList(res.data);
      } else {
        setError(res?.message || 'Gagal memuat status kelas');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalisasi = async (classId: string) => {
    try {
      const res = await submitFinalisasiKelas(classId);
      if (res?.success) {
        alert('Kelas berhasil difinalisasi. Nilai Khos dan Nilai \'Am telah dikunci.');
        loadData(); // Reload list
      } else {
        alert(res?.message || 'Gagal melakukan finalisasi kelas.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat memproses finalisasi.');
    }
  };

  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-emerald-300/20 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <div className={`${neumorphicShadow} rounded-b-[32px] px-6 pt-6 pb-6 z-10 mb-6 -mx-4 md:mx-0 md:rounded-[32px] md:mt-2`}>
        <p className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest mb-1">Mufatish & Mundzir</p>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Finalisasi Kelas</h1>
        <p className="text-slate-500 font-semibold mt-1">Kunci & Kalkulasi Nilai Otomatis</p>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center mt-20">
             <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
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
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Kelas</h2>
             <p className="text-slate-500 text-center">Data kelas belum tersedia atau belum ada yang siap difinalisasi.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {kelasList.map((k) => (
              <div key={k.id} className={`${neumorphicShadow} rounded-[24px] p-5 border-2`}>
                <div className="mb-4 flex flex-row justify-between items-center">
                  <div>
                    <h3 className="text-slate-800 font-extrabold text-lg">{k.name}</h3>
                    <p className="text-slate-400 font-medium text-xs mt-0.5">Wali: <span className="text-slate-500 font-bold">{k.wali}</span></p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${k.status === 'Draft' ? 'bg-amber-100' : k.status === 'Siap Finalisasi' ? 'bg-blue-100' : k.status === 'SUDAH FINAL' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    <span className={`text-[10px] font-bold ${k.status === 'Draft' ? 'text-amber-700' : k.status === 'Siap Finalisasi' ? 'text-blue-700' : k.status === 'SUDAH FINAL' ? 'text-emerald-700' : 'text-slate-700'}`}>{k.status}</span>
                  </div>
                </div>
                
                <div className="flex flex-row justify-between items-center mb-5">
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Santri</p>
                    <p className="text-slate-800 font-black text-xl">{k.totalSantri}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Input Selesai</p>
                    <p className="text-slate-800 font-black text-xl">{k.progress}%</p>
                  </div>
                </div>

                {k.status !== 'SUDAH FINAL' ? (
                  <button 
                    onClick={() => handleFinalisasi(k.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all py-4 rounded-xl flex items-center justify-center shadow-[0_4px_8px_rgba(16,185,129,0.3)]"
                  >
                    <ShieldCheck className="text-white w-5 h-5 mr-2" />
                    <span className="text-white font-black text-sm tracking-wider">FINALISASI KELAS</span>
                  </button>
                ) : (
                  <div className="w-full bg-emerald-50 py-4 rounded-xl flex items-center justify-center border border-emerald-200">
                    <ShieldCheck className="text-emerald-700 w-5 h-5 mr-2" />
                    <span className="text-emerald-700 font-black text-sm tracking-wider">SUDAH FINAL</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
