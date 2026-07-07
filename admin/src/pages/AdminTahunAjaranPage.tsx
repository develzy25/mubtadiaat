import { useState } from 'react';
import { Calendar, Save, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';

export const AdminTahunAjaranPage = () => {
  const { activeAcademicYear, updateAcademicYear, isLoading } = useSettingsStore();
  const [selectedYear, setSelectedYear] = useState(activeAcademicYear);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (selectedYear !== activeAcademicYear) {
      await updateAcademicYear(selectedYear);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const academicYears = [
    '2025-2026',
    '2026-2027',
    '2027-2028',
    '2028-2029',
    '2029-2030'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2" />
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600">
              <Calendar className="w-6 h-6" />
            </div>
            Pengaturan Tahun Ajaran
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-xl leading-relaxed">
            Pilih dan kelola tahun ajaran aktif untuk sistem administrasi.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Section */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          <div className="space-y-6">
            
            {/* Information Alert */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-1">Pentingnya Tahun Ajaran</h3>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  Tahun ajaran yang Anda pilih di sini akan digunakan secara global oleh semua modul. Data Rapot, Absensi, dan Jadwal Pelajaran akan menyesuaikan secara otomatis dengan periode tahun ajaran yang aktif.
                </p>
              </div>
            </div>

            {/* Selection */}
            <div>
              <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-3">
                Tahun Ajaran Aktif Saat Ini
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-14 pl-5 pr-10 appearance-none bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-800 transition-all focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading || selectedYear === activeAcademicYear}
                className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-indigo-600 shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSaved ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaved ? 'Berhasil Disimpan' : 'Simpan Perubahan'}
              </button>

              {selectedYear !== activeAcademicYear && !isLoading && !isSaved && (
                <button
                  onClick={() => setSelectedYear(activeAcademicYear)}
                  className="px-6 py-3.5 text-slate-500 font-bold rounded-xl transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                >
                  Batal
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Warning / Tips Section */}
        <div className="bg-rose-50 rounded-3xl p-6 shadow-inner border border-rose-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-rose-100 text-rose-600 p-2 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-rose-900">Perhatian</h3>
          </div>
          <div className="space-y-4 text-sm text-rose-800/80 leading-relaxed">
            <p>
              Pastikan Anda hanya mengubah Tahun Ajaran pada saat <strong>pergantian semester atau tahun ajaran baru</strong>.
            </p>
            <p>
              Mengubah Tahun Ajaran di tengah periode belajar dapat menyebabkan data rapor dan absensi sebelumnya tersembunyi dari tampilan admin secara sementara.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
