import { useState, useEffect } from 'react';
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchKelasMustahiq, fetchPenilaianKelas, savePenilaianKuartal } from '../../services/guru.service';

const KUARTAL_OPTIONS = [
  { id: 1, name: 'Kuartal 1', desc: 'Tamrin Smt I' },
  { id: 2, name: 'Kuartal 2', desc: 'Ujian Smt I' },
  { id: 3, name: 'Kuartal 3', desc: 'Tamrin Smt II' },
  { id: 4, name: 'Kuartal 4', desc: 'Ujian Smt II' }
];

const MAPEL_OPTIONS = [
  { id: '1', name: 'Nahwu' },
  { id: '2', name: 'Fiqih' },
  { id: '3', name: 'Tauhid' },
  { id: '4', name: "Al-Qur'an" }, // Max 8
  { id: '5', name: 'Akhlaq' } // Max 8
];

export const GuruPenilaian = () => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeKuartal, setActiveKuartal] = useState(1);
  const [activeMapel, setActiveMapel] = useState('1');
  const [activeClassId, setActiveClassId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const classRes = await fetchKelasMustahiq();
        if (classRes?.success && classRes.data.length > 0) {
          const classId = classRes.data[0].id;
          setActiveClassId(classId);
          
          const res = await fetchPenilaianKelas(classId, activeMapel, activeKuartal.toString());
          if (res?.success) {
            const initialized = res.data.map((s: any) => ({
              ...s,
              nilai: s.nilai?.toString() || ''
            }));
            setScores(initialized);
          } else {
            setError(res?.message || 'Gagal memuat daftar santri');
          }
        } else {
          setError('Tidak ada kelas yang aktif untuk Anda.');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeKuartal, activeMapel]);

  const updateScore = (id: string, val: string) => {
    const isSpecialMapel = MAPEL_OPTIONS.find(m => m.id === activeMapel)?.name === "Al-Qur'an" || 
                           MAPEL_OPTIONS.find(m => m.id === activeMapel)?.name === 'Akhlaq';
    const maxVal = isSpecialMapel ? 8 : 10;
    
    let cleaned = val.replace(',', '.');
    
    if (cleaned !== '' && parseFloat(cleaned) > maxVal) {
      cleaned = maxVal.toString();
    }

    setScores(prev => prev.map(s => s.id === id ? { ...s, nilai: cleaned } : s));
  };

  const submitNilai = async () => {
    if (!activeClassId) return;
    
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
    }
  };

  const neumorphicShadow = "bg-white shadow-[4px_8px_20px_rgba(148,163,184,0.15)] border border-white";

  return (
    <div className="relative min-h-[80vh] flex flex-col pb-24">
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <div className={`${neumorphicShadow} rounded-b-[32px] pt-6 pb-4 z-10 mb-6 -mx-4 md:mx-0 md:rounded-[32px] md:mt-2`}>
        <div className="px-6 mb-4">
          <p className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Input Nilai</p>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Kuartal & Mata Pelajaran</h1>
        </div>

        {/* Kuartal Selector */}
        <div className="flex flex-row overflow-x-auto px-6 mb-4 gap-3 snap-x pb-2">
          {KUARTAL_OPTIONS.map(k => (
            <button 
              key={k.id}
              onClick={() => setActiveKuartal(k.id)}
              className={`flex flex-col shrink-0 px-4 py-2 rounded-full border-2 snap-start transition-all ${activeKuartal === k.id ? 'bg-blue-600 border-blue-600 shadow-[0_4px_8px_rgba(37,99,235,0.3)]' : 'bg-white border-slate-200'}`}
            >
              <span className={`font-bold ${activeKuartal === k.id ? 'text-white' : 'text-slate-600'}`}>{k.name}</span>
              <span className={`text-[9px] font-medium mt-0.5 ${activeKuartal === k.id ? 'text-blue-100' : 'text-slate-400'}`}>{k.desc}</span>
            </button>
          ))}
        </div>

        {/* Mapel Selector */}
        <div className="flex flex-row overflow-x-auto px-6 gap-3 snap-x pb-2">
          {MAPEL_OPTIONS.map(m => (
            <button 
              key={m.id}
              onClick={() => setActiveMapel(m.id)}
              className={`shrink-0 px-4 py-2 rounded-2xl border-2 snap-start transition-all ${activeMapel === m.id ? 'bg-indigo-600 border-indigo-600 shadow-[0_4px_8px_rgba(79,70,229,0.3)]' : 'bg-slate-50 border-slate-100'}`}
            >
              <span className={`font-bold text-sm ${activeMapel === m.id ? 'text-white' : 'text-slate-600'}`}>{m.name}</span>
            </button>
          ))}
        </div>
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
        ) : scores.length === 0 ? (
          <div className="mt-20 flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet className="text-blue-500 w-8 h-8" />
             </div>
             <h2 className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Data</h2>
             <p className="text-slate-500 text-center">Data santri belum tersedia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between px-2 mb-1">
               <span className="text-slate-500 font-bold text-xs">NAMA SANTRI</span>
               <span className="text-slate-500 font-bold text-xs">NILAI KUARTAL {activeKuartal}</span>
            </div>
            {scores.map((s) => (
              <div key={s.id} className={`${neumorphicShadow} rounded-[20px] p-4 flex flex-row items-center justify-between border-2`}>
                <div className="flex-1 pr-4">
                  <h3 className="text-slate-800 font-extrabold text-base">{s.name}</h3>
                  <p className="text-slate-400 font-medium text-xs mt-0.5">
                    Stambuk: <span className="text-slate-500 font-bold">{s.noStambuk}</span>
                  </p>
                </div>
                
                <div className="w-24">
                  <input
                    type="number"
                    step="0.5"
                    className="w-full bg-[#F1F5F9] rounded-xl px-4 py-3 text-slate-800 font-black text-center shadow-inner text-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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

      {/* Premium 3D Save Button */}
      {!loading && !error && scores.length > 0 && (
        <div className="sticky bottom-4 mt-8 flex justify-center">
          <button 
            onClick={submitNilai}
            className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all h-16 rounded-[24px] flex items-center justify-center overflow-hidden shadow-[0_8px_16px_rgba(37,99,235,0.4)] relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-[24px]" />
            <CheckCircle2 className="text-white w-6 h-6 mr-2 relative z-10" />
            <span className="text-white font-black text-lg tracking-wider relative z-10">SIMPAN NILAI</span>
          </button>
        </div>
      )}
    </div>
  );
};
