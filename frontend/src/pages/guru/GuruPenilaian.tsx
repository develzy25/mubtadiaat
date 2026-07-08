
import { useState, useEffect } from 'react';
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchKelasMustahiq, fetchPenilaianKelas, savePenilaianKuartal, fetchJadwalMengajar } from '../../services/guru.service';
import { PremiumButton } from '../../components/ui/PremiumButton';

const KUARTAL_OPTIONS = [
  { id: 1, name: 'Kuartal 1', desc: 'Tamrin Smt I' },
  { id: 2, name: 'Kuartal 2', desc: 'Ujian Smt I' },
  { id: 3, name: 'Kuartal 3', desc: 'Tamrin Smt II' },
  { id: 4, name: 'Kuartal 4', desc: 'Ujian Smt II' }
];

const FALLBACK_MAPEL_OPTIONS = [
  { id: 'ktb_nahwu', name: 'Nahwu' },
  { id: 'ktb_fiqih', name: 'Fiqih' },
  { id: 'ktb_tauhid', name: 'Tauhid' },
  { id: 'ktb_alquran', name: "Al-Qur'an" },
  { id: 'ktb_akhlaq', name: 'Akhlaq' }
];

export const GuruPenilaian = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [mapelOptions, setMapelOptions] = useState<any[]>([]);
  
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [activeKuartal, setActiveKuartal] = useState(1);
  const [activeMapel, setActiveMapel] = useState('');
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [className, setClassName] = useState<string>('');

  // 1. Initial Load of classes and teaching schedules
  useEffect(() => {
    const initData = async () => {
      try {
        const [classRes, jadwalRes] = await Promise.all([
          fetchKelasMustahiq(),
          fetchJadwalMengajar()
        ]);

        if (classRes?.success && classRes.data.length > 0) {
          setClasses(classRes.data);
          const initialClass = classRes.data[0];
          setActiveClassId(initialClass.id);
          setClassName(initialClass.bagian ? `Kelas ${initialClass.bagian}` : 'Kelas Aktif');
        } else {
          setError('Tidak ada kelas yang aktif untuk Anda.');
        }

        if (jadwalRes?.success) {
          setJadwal(jadwalRes.data);
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat kelas & jadwal.');
      }
    };
    initData();
  }, []);

  // 2. Filter mapel dynamically based on the selected class
  useEffect(() => {
    if (!activeClassId) return;

    const selectedClass = classes.find(c => c.id === activeClassId);
    if (selectedClass) {
      setClassName(selectedClass.bagian ? `Kelas ${selectedClass.bagian} (${selectedClass.lokal || ''})` : 'Kelas Aktif');
    }

    // Filter books taught by this teacher in the active class
    const classJadwal = jadwal.filter(j => j.kelasId === activeClassId);
    
    // Map unique kitab values
    const uniqueKitabs: any[] = [];
    const seen = new Set();
    classJadwal.forEach(j => {
      if (j.kitabId && !seen.has(j.kitabId)) {
        seen.add(j.kitabId);
        uniqueKitabs.push({ id: j.kitabId, name: j.kitab });
      }
    });

    // Fallback if no matching schedules
    const options = uniqueKitabs.length > 0 ? uniqueKitabs : FALLBACK_MAPEL_OPTIONS;
    setMapelOptions(options);

    // Set first mapel as active if current is not in options
    if (options.length > 0 && (!activeMapel || !options.some(o => o.id === activeMapel))) {
      setActiveMapel(options[0].id);
    }
  }, [activeClassId, classes, jadwal, activeMapel]);

  // 3. Load students and grades when class, subject, or kuartal changes
  useEffect(() => {
    if (!activeClassId || !activeMapel) return;

    const loadSantriScores = async () => {
      setLoading(true);
      try {
        const res = await fetchPenilaianKelas(activeClassId, activeMapel, activeKuartal.toString());
        if (res?.success) {
          const initialized = res.data.map((s: any) => ({
            ...s,
            nilai: s.nilai?.toString() || ''
          }));
          setScores(initialized);
          setError(null);
        } else {
          setError(res?.message || 'Gagal memuat daftar nilai santri');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data penilaian.');
      } finally {
        setLoading(false);
      }
    };

    loadSantriScores();
  }, [activeClassId, activeMapel, activeKuartal]);

  const updateScore = (id: string, val: string) => {
    const activeKitabName = mapelOptions.find(m => m.id === activeMapel)?.name || '';
    const isSpecialMapel = activeKitabName === "Al-Qur'an" || activeKitabName === 'Akhlaq';
    const maxVal = isSpecialMapel ? 8 : 10;
    
    let cleaned = val.replace(',', '.');
    
    if (cleaned !== '' && parseFloat(cleaned) > maxVal) {
      cleaned = maxVal.toString();
    }

    setScores(prev => prev.map(s => s.id === id ? { ...s, nilai: cleaned } : s));
  };

  const submitNilai = async () => {
    if (!activeClassId || !activeMapel) return;
    
    setSubmitting(true);
    try {
      const payload = {
        classId: activeClassId,
        mapelId: activeMapel,
        kuartal: activeKuartal,
        scores: scores.map(s => ({
          santri_id: s.id,
          nilai: parseFloat(s.nilai) || null
        }))
      };
      
      await savePenilaianKuartal(payload);
      alert('Nilai Berhasil Disimpan!');
    } catch(e) {
      console.error(e);
      alert('Gagal menyimpan nilai. Periksa koneksi Anda.'); 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      
      {/* Premium Header */}
      <div className="premium-card bg-white pt-6 pb-5 z-10 mb-6 border border-slate-200/50 shadow-sm rounded-3xl">
        <div className="px-6 mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sky-600 font-extrabold text-xs uppercase tracking-widest mb-1">Input Nilai &bull; {className}</p>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lembar Penilaian Kuartal</h1>
          </div>

          {classes.length > 1 && (
            <div className="min-w-48">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Pilih Rombel Kelas</label>
              <select
                value={activeClassId || ''}
                onChange={(e) => {
                  setActiveClassId(e.target.value);
                  setActiveMapel('');
                }}
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

        {/* Kuartal Selector */}
        <div className="flex flex-row overflow-x-auto px-6 mb-5 gap-3 snap-x pb-2 custom-scrollbar">
          {KUARTAL_OPTIONS.map(k => (
            <button 
              key={k.id}
              onClick={() => setActiveKuartal(k.id)}
              className={`flex flex-col shrink-0 px-5 py-2.5 rounded-full border snap-start transition-all duration-300 ${activeKuartal === k.id ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/25' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              <span className="font-bold text-sm">{k.name}</span>
              <span className={`text-[9px] font-semibold mt-0.5 ${activeKuartal === k.id ? 'text-sky-100' : 'text-slate-400'}`}>{k.desc}</span>
            </button>
          ))}
        </div>

        {/* Mapel Selector */}
        <div className="flex flex-row overflow-x-auto px-6 gap-3 snap-x pb-2 custom-scrollbar">
          {mapelOptions.map(m => (
            <button 
              key={m.id}
              onClick={() => setActiveMapel(m.id)}
              className={`shrink-0 px-5 py-2.5 rounded-2xl border snap-start transition-all duration-300 ${activeMapel === m.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 border-slate-200/50 text-slate-600 hover:bg-slate-100/50'}`}
            >
              <span className="font-bold text-sm tracking-wide">{m.name}</span>
            </button>
          ))}
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
        ) : scores.length === 0 ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet className="text-sky-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Data</h2>
             <p className="text-slate-500 text-center font-medium">Data santri belum tersedia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between px-2 mb-1">
               <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-widest">NAMA SANTRI</span>
               <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-widest text-right">NILAI KUARTAL {activeKuartal}</span>
            </div>
            {scores.map((s) => (
              <div key={s.id} className="premium-card bg-white p-4 flex flex-row items-center justify-between border border-slate-200/50 rounded-2xl transition-all duration-300 hover:shadow-md">
                <div className="flex-1 pr-4">
                  <h3 className="text-slate-800 font-extrabold text-sm sm:text-base">{s.name}</h3>
                  <p className="text-slate-400 font-medium text-xs mt-0.5">
                    No. Stambuk: <span className="text-slate-600 font-bold">{s.noStambuk}</span>
                  </p>
                </div>
                
                <div className="w-24">
                  <input
                    type="number"
                    step="0.5"
                    className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-slate-700 font-black text-center border border-slate-200 text-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all shadow-inner"
                    value={s.nilai}
                    onChange={(e) => updateScore(s.id, e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      {!loading && !error && scores.length > 0 && (
        <div className="sticky bottom-6 mt-8 flex justify-center z-20">
          <PremiumButton 
            onClick={submitNilai}
            isLoading={submitting}
            variant="gold"
            className="w-full max-w-sm h-14 rounded-2xl flex items-center justify-center font-black text-sm tracking-widest uppercase border border-gold/40 shadow-xl"
            rightIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            SIMPAN NILAI
          </PremiumButton>
        </div>
      )}
    </div>
  );
};
