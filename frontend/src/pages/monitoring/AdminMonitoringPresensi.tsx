import { useState, useEffect } from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { fetchMonitoringData } from '../../services/admin.service';
import { GlassCard } from '../../components/ui';

export const AdminMonitoringPresensi = () => {
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
          setError(res?.message || 'Gagal memuat rekap presensi kelas.');
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

  return (
    <div className="space-y-6">
      {/* 3D Header Card */}
      <GlassCard className="relative overflow-hidden p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-blue-500/20 to-cyan-500/0 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-linear-to-tr from-blue-600 to-cyan-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] border border-blue-400/30">
            <Calendar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Rekap Presensi Seluruh Kelas</h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Monitoring Kehadiran Santri Realtime
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Datatable */}
      <GlassCard variant="neumorph" className="overflow-hidden border border-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-rose-500" />
            <p className="text-rose-500 font-semibold text-xs uppercase tracking-wide">{error}</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 pl-4">Nama Kelas</th>
                <th className="py-4">Mustahiq (Wali Kelas)</th>
                <th className="py-4 text-center">Total Santri</th>
                <th className="py-4 text-center">Status Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monitoringList.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-4 font-bold text-slate-850">{m.name}</td>
                  <td className="py-4 font-semibold text-slate-600">{m.wali}</td>
                  <td className="py-4 text-center font-bold text-slate-800">{m.totalSantri}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      m.totalSantri > 0
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-500/10 text-slate-600 border border-slate-200'
                    }`}>
                      {m.totalSantri > 0 ? 'Sudah Diabsen' : 'Belum Mulai'}
                    </span>
                  </td>
                </tr>
              ))}
              {monitoringList.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-20 text-slate-400 italic">
                    Tidak ada data kelas aktif ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
};
