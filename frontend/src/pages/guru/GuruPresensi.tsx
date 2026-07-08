import { useState, useEffect } from 'react';
import { AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
import { fetchKelasMustahiq, fetchPresensiHarian, savePresensiHarian } from '../../services/guru.service';
import { PremiumButton } from '../../components/ui/PremiumButton';

export const GuruPresensi = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [santriList, setSantriList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [className, setClassName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classRes = await fetchKelasMustahiq();
        if (classRes?.success && classRes.data.length > 0) {
          setClasses(classRes.data);
          const initialClass = classRes.data[0];
          setActiveClassId(initialClass.id);
          setClassName(initialClass.bagian ? `Kelas ${initialClass.bagian}` : 'Kelas Aktif');
        } else {
          setError('Tidak ada kelas yang aktif untuk Anda.');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data kelas.');
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    if (!activeClassId) return;

    const loadSantri = async () => {
      setLoading(true);
      try {
        const selectedClass = classes.find(c => c.id === activeClassId);
        if (selectedClass) {
          setClassName(selectedClass.bagian ? `Kelas ${selectedClass.bagian} (${selectedClass.lokal || ''})` : 'Kelas Aktif');
        }

        const res = await fetchPresensiHarian(activeClassId);
        if (res?.success) {
          const initialized = res.data.map((s: any) => ({
            ...s,
            izin: s.izin?.toString() || '',
            alpha: s.alpha?.toString() || ''
          }));
          setSantriList(initialized);
          setError(null);
        } else {
          setError(res?.message || 'Gagal memuat presensi');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data presensi.');
      } finally {
        setLoading(false);
      }
    };

    loadSantri();
  }, [activeClassId, classes]);

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
    
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      {/* Premium Header Card */}
      <div className="premium-card bg-white px-6 py-6 z-10 mb-6 border border-slate-200/50 shadow-sm rounded-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sky-600 font-extrabold text-xs uppercase tracking-widest mb-1">Manajemen {className}</p>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rekap Absensi Santri</h1>
            <p className="text-slate-500 font-semibold mt-1">Input jumlah Kehadiran Al-Ghoibah per Semester</p>
          </div>
          
          {classes.length > 1 && (
            <div className="min-w-48">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Pilih Rombel Kelas</label>
              <select
                value={activeClassId || ''}
                onChange={(e) => setActiveClassId(e.target.value)}
                className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-slate-700 font-bold focus:outline-hidden focus:ring-2 focus:ring-sky-500 border border-slate-200 text-sm shadow-sm transition-all"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Kelas {cls.bagian} ({cls.lokal || 'Utama'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin"></div>
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
             <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet className="text-sky-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Santri</h2>
             <p className="text-slate-500 text-center font-medium">Belum ada data santri di kelas ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {santriList.map((santri) => (
              <div key={santri.id} className="premium-card bg-white p-5 border border-slate-200/50 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-md">
                <div className="mb-4">
                  <h3 className="text-slate-800 font-extrabold text-base">{santri.name}</h3>
                  <p className="text-slate-400 font-medium text-xs mt-0.5">
                    No. Stambuk: <span className="text-slate-600 font-bold">{santri.noStambuk}</span>
                  </p>
                </div>
                
                <div className="flex flex-row justify-between gap-4">
                  <div className="flex-1">
                     <p className="text-slate-400 font-extrabold text-[9px] uppercase tracking-widest mb-1.5 ml-1">Total Izin (Hari)</p>
                     <input
                       type="number"
                       className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-slate-700 font-bold focus:outline-hidden focus:ring-2 focus:ring-sky-500 border border-slate-200 text-sm shadow-inner transition-all"
                       value={santri.izin}
                       onChange={(e) => handleInput(santri.id, 'izin', e.target.value)}
                       placeholder="0"
                     />
                  </div>
                  <div className="flex-1">
                     <p className="text-slate-400 font-extrabold text-[9px] uppercase tracking-widest mb-1.5 ml-1">Total Alpha (Hari)</p>
                     <input
                       type="number"
                       className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-slate-700 font-bold focus:outline-hidden focus:ring-2 focus:ring-sky-500 border border-slate-200 text-sm shadow-inner transition-all"
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

      {/* Save Button */}
      {!loading && !error && santriList.length > 0 && (
        <div className="sticky bottom-6 mt-8 flex justify-center z-20">
          <PremiumButton 
            onClick={submitPresensi}
            isLoading={submitting}
            variant="gold"
            className="w-full max-w-sm h-14 rounded-2xl flex items-center justify-center font-black text-sm tracking-widest uppercase border border-gold/40 shadow-xl"
            rightIcon={<Check className="w-5 h-5" />}
          >
            SIMPAN ABSENSI
          </PremiumButton>
        </div>
      )}
    </div>
  );
};
