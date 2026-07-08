import { useState, useEffect } from 'react';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { fetchMonitoringData } from '../../services/admin.service';
import { GlassCard } from '../../components/ui';

export const AdminMonitoringPenilaian = () => {
  const [monitoringList, setMonitoringList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchMonitoringData();
        if (res?.success) {
          setMonitoringList(res.data);
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

  return (
    <div className="space-y-6">
      {/* 3D Header Card */}
      <GlassCard className="relative overflow-hidden p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-emerald-500/20 to-cyan-500/0 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-linear-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] border border-emerald-400/30">
            <FileSpreadsheet className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Progres Penilaian Pengajar</h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Status Kelengkapan Nilai Per Kelas
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-slate-200/50">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="py-20 flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-200/50">
          <AlertCircle className="w-10 h-10 text-rose-500" />
          <p className="text-rose-500 font-semibold text-xs uppercase tracking-wide">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {monitoringList.map((m) => (
            <GlassCard key={m.id} className="p-5 flex flex-col justify-between border-white/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-800 font-extrabold text-base leading-snug">{m.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    m.status === 'SUDAH FINAL' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : m.status === 'Siap Finalisasi'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-slate-400 font-semibold text-xs">Mustahiq (Wali): <span className="text-slate-600 font-bold">{m.wali}</span></p>
                <p className="text-slate-400 font-semibold text-xs mt-1">Total Santri: <span className="text-slate-600 font-bold">{m.totalSantri} Siswa</span></p>
              </div>
              
              <div className="w-full pt-4 border-t border-slate-100 mt-6">
                <div className="flex justify-between text-slate-450 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span>Progres Nilai</span>
                  <span>{m.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-550" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            </GlassCard>
          ))}
          {monitoringList.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400 italic">
              Tidak ada data kelas aktif ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
};
