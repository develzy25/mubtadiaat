import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Search, Printer, Medal, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { kelulusanService } from '../services/kelulusan.service';
import { useSettingsStore } from '../stores/useSettingsStore';

export function AdminKelulusanPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sertifikat' | 'ijazah'>('sertifikat');
  const selectedKelas = 'kelas-id-temp';
  const { activeAcademicYear } = useSettingsStore();

  const { data: kelulusanData, isLoading } = useQuery({
    queryKey: ['kelulusan', activeTab, selectedKelas, activeAcademicYear],
    queryFn: () => activeTab === 'sertifikat' 
      ? kelulusanService.getSertifikat(selectedKelas, activeAcademicYear)
      : kelulusanService.getIjazah(selectedKelas, activeAcademicYear)
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Medal className="w-8 h-8 text-indigo-600" />
            Kelulusan & Administrasi Akhir
          </h1>
          <p className="text-slate-500 font-medium">Manajemen Sertifikat (I'dadiyah) & Ijazah (Tingkat Akhir)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sertifikat')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'sertifikat' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Sertifikat I'dadiyah
          {activeTab === 'sertifikat' && (
            <motion.div layoutId="kelulusanTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('ijazah')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'ijazah' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Ijazah & Transkrip
          {activeTab === 'ijazah' && (
            <motion.div layoutId="kelulusanTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[400px]">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama santri atau NIS..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:ring-2 focus:ring-indigo-500/20">
              <option>Semua Rombel</option>
              {activeTab === 'sertifikat' ? (
                <>
                  <option>I'dadiyah Kelas I</option>
                  <option>I'dadiyah Kelas II</option>
                  <option>I'dadiyah Kelas III</option>
                </>
              ) : (
                <>
                  <option>Ibtidaiyyah Kelas VI</option>
                  <option>Tsanawiyah Kelas III</option>
                  <option>Aliyah Kelas III</option>
                </>
              )}
            </select>
            <button 
              onClick={() => navigate(`/print/kelulusan/${activeTab}`)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_4px_10px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Massal</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Memuat data asli dari database D1...</p>
          </div>
        ) : !kelulusanData || kelulusanData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Data</h3>
            <p className="text-slate-500 max-w-sm">Data kelulusan untuk rombel ini kosong atau kelas belum dipilih.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 font-bold text-slate-700">Nama Santri</th>
                  <th className="py-3 px-4 font-bold text-slate-700">NIS</th>
                  <th className="py-3 px-4 font-bold text-slate-700">Rata-rata</th>
                  <th className="py-3 px-4 font-bold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-bold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelulusanData.map((item: any) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{item.noStambuk || '-'}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {activeTab === 'sertifikat' ? (item.rataRata || '-') : (item.rataRataAkhir || '-')}
                    </td>
                    <td className="py-3 px-4">
                      {item.lulus ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" /> Lulus
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          <XCircle className="w-3 h-3" /> Belum Lulus
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => navigate(`/print/kelulusan/${activeTab}?santriId=${item.id}`)}
                        className="px-3 py-1.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        Cetak Personal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
