import { useState, useEffect } from 'react';
import { AlertCircle, FileSpreadsheet } from 'lucide-react';
import { fetchKelasMustahiq, fetchPresensiHarian, savePresensiHarian } from '../../services/guru.service';

export const GuruPresensi = () => {
  const [santriList, setSantriList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [className, setClassName] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const classRes = await fetchKelasMustahiq();
        if (classRes?.success && classRes.data.length > 0) {
          const classData = classRes.data[0];
          setActiveClassId(classData.id);
          setClassName(classData.bagian ? `Kelas ${classData.bagian}` : 'Kelas Aktif');
          
          const res = await fetchPresensiHarian(classData.id);
          if (res?.success) {
            const initialized = res.data.map((s: any) => ({
              ...s,
              izin: s.izin?.toString() || '',
              alpha: s.alpha?.toString() || ''
            }));
            setSantriList(initialized);
          } else {
            setError(res?.message || 'Gagal memuat presensi');
          }
        } else {
           setError('Tidak ada kelas yang aktif untuk Anda.');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data presensi.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInput = (santriId: string, field: 'izin' | 'alpha', value: string) => {
    setSantriList(prev => prev.map(s => {
      if (s.id === santriId) {
        return {
          ...s,
          [field]: value,
        };
      }
      return s;
    }));
  };

  const submitPresensi = async () => {
    if (!activeClassId) {
      alert('Tidak ada kelas yang aktif');
      return;
    }
    
    try {
      const payload = santriList.map(s => ({
        santri_id: s.id,
        izin: parseInt(s.izin) || 0,
        alpha: parseInt(s.alpha) || 0
      }));
      await savePresensiHarian(activeClassId, payload);
      alert('Rekap Absensi Berhasil Disimpan!');
    } catch(e) {
      console.error(e);
      alert('Gagal menyimpan rekap absensi. Periksa koneksi Anda.'); 
    }
  };

  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      {/* 3D Glassmorphism Abstract Background */}
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      {/* Premium Header */}
      <div className={`${neumorphicShadow} rounded-b-[32px] px-6 pt-6 pb-6 z-10 mb-6 -mx-4 md:mx-0 md:rounded-[32px] md:mt-2`}>
        <p className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Manajemen {className}</p>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rekap Absensi</h1>
        <p className="text-slate-500 font-semibold mt-1">Input jumlah Izin & Alpha per Semester</p>
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
        ) : santriList.length === 0 ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet className="text-blue-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Santri</h2>
             <p className="text-slate-500 text-center font-medium">Belum ada data santri di kelas ini.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {santriList.map((santri) => (
              <div key={santri.id} className={`${neumorphicShadow} rounded-[24px] p-5 border-2`}>
                <div className="mb-5 flex flex-row justify-between items-center">
                  <div>
                    <h3 className="text-slate-800 font-extrabold text-lg">{santri.name}</h3>
                    <p className="text-slate-400 font-medium text-xs mt-0.5">
                      Stambuk: <span className="text-slate-500 font-bold">{santri.noStambuk}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-row justify-between gap-4">
                  <div className="flex-1">
                     <p className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider mb-2 ml-1">Total Izin (Hari)</p>
                     <input
                       type="number"
                       className="w-full bg-[#F1F5F9] rounded-2xl px-4 py-3 text-slate-800 font-bold shadow-inner focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                       value={santri.izin}
                       onChange={(e) => handleInput(santri.id, 'izin', e.target.value)}
                       placeholder="0"
                     />
                  </div>
                  <div className="flex-1">
                     <p className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider mb-2 ml-1">Total Alpha (Hari)</p>
                     <input
                       type="number"
                       className="w-full bg-[#F1F5F9] rounded-2xl px-4 py-3 text-slate-800 font-bold shadow-inner focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                       value={santri.alpha}
                       onChange={(e) => handleInput(santri.id, 'alpha', e.target.value)}
                       placeholder="0"
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium 3D Save Button */}
      {!loading && !error && santriList.length > 0 && (
        <div className="sticky bottom-4 mt-8 flex justify-center">
          <button 
            onClick={submitPresensi}
            className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all h-16 rounded-[24px] flex items-center justify-center overflow-hidden shadow-[0_8px_16px_rgba(37,99,235,0.4)] relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-[24px]" />
            <span className="text-white font-black text-lg tracking-wider relative z-10">SIMPAN ABSENSI</span>
          </button>
        </div>
      )}
    </div>
  );
};
