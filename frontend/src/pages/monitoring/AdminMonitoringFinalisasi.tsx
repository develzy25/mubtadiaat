import { useState, useEffect } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { fetchMonitoringData, finalizeKelasAdmin } from '../../services/admin.service';
import { GlassCard, PremiumButton } from '../../components/ui';

export const AdminMonitoringFinalisasi = () => {
  const [monitoringList, setMonitoringList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchMonitoringData();
      if (res?.success) {
        setMonitoringList(res.data);
      } else {
        setError(res?.message || 'Gagal memuat status finalisasi kelas.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFinalisasi = async (classId: string) => {
    try {
      const res = await finalizeKelasAdmin(classId, '1'); // Default to semester 1 or dynamic if needed
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

  return (
    <div className="space-y-6">
      {/* 3D Header Card */}
      <GlassCard className="relative overflow-hidden p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-linear-to-tr from-indigo-600 to-purple-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Status Finalisasi Nilai Kelas</h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Kunci & Kalkulasi Nilai Otomatis Seluruh Kelas
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Datatable */}
      <GlassCard variant="neumorph" className="overflow-hidden border border-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
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
                <th className="py-4 text-center">Progres Input</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 text-right pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monitoringList.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-4 font-bold text-slate-850">{k.name}</td>
                  <td className="py-4 font-semibold text-slate-600">{k.wali}</td>
                  <td className="py-4 text-center font-bold text-slate-800">{k.totalSantri}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden shrink-0">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${k.progress}%` }} />
                      </div>
                      <span className="font-bold text-slate-700 text-[10px] w-8 text-right">{k.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      k.status === 'SUDAH FINAL' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' 
                        : k.status === 'Siap Finalisasi'
                        ? 'bg-blue-500/10 text-blue-600 border border-blue-200 animate-pulse'
                        : k.status === 'Progress'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-200'
                        : 'bg-slate-500/10 text-slate-600 border border-slate-200'
                    }`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    {k.status !== 'SUDAH FINAL' ? (
                      <PremiumButton
                        onClick={() => handleFinalisasi(k.id)}
                        disabled={k.status !== 'Siap Finalisasi'}
                        className="py-1.5 px-3 text-[10px] bg-indigo-600 hover:bg-indigo-700 shadow-none h-auto min-h-[30px]"
                      >
                        Finalisasi
                      </PremiumButton>
                    ) : (
                      <span className="text-slate-400 font-bold text-[10px] uppercase">Terkunci</span>
                    )}
                  </td>
                </tr>
              ))}
              {monitoringList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400 italic">
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
