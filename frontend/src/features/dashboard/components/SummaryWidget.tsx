import React from 'react';
import { Calendar, Users, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';

interface SummaryWidgetProps {
  totalSantri: number;
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpha: number;
  };
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ totalSantri, attendance }) => {
  // Compute stats dynamically from database parameters
  const sudahDiisi = (attendance.hadir || 0) + (attendance.sakit || 0) + (attendance.izin || 0) + (attendance.alpha || 0);
  const belumDiisi = Math.max(0, totalSantri - sudahDiisi);
  const persentase = totalSantri > 0 ? Math.round((sudahDiisi / totalSantri) * 100) : 0;
  
  const stats = {
    jadwalTamrin: totalSantri > 0 ? 2 : 0, // Number of tamrin active classes
    jumlahSantri: totalSantri,
    sudahDiisi,
    belumDiisi,
    persentase,
  };

  const cards = [
    {
      title: 'Tamrin Hari Ini',
      value: stats.jadwalTamrin,
      subtitle: 'Sesi aktif',
      icon: Calendar,
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Santri Binaan',
      value: stats.jumlahSantri,
      subtitle: 'Total siswa',
      icon: Users,
      iconBg: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: 'Sudah Diisi',
      value: stats.sudahDiisi,
      subtitle: 'Nilai terinput',
      icon: CheckCircle,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'Belum Diisi',
      value: stats.belumDiisi,
      subtitle: 'Sisa pengisian',
      icon: AlertCircle,
      iconBg: 'bg-amber-500/10 text-amber-600',
    },
  ];

  return (
    <div className="flex flex-col gap-4 my-6">
      <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider px-1">Ringkasan Hari Ini</h3>

      {/* 4 Neumorphic Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <GlassCard 
              key={idx} 
              variant="neumorph" 
              hoverEffect 
              className="p-4 flex flex-col items-center text-center justify-between min-h-32 transition-transform"
            >
              <div className={`w-10 h-10 rounded-2xl ${card.iconBg} flex items-center justify-center mb-2 neumorph-pressed`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 mb-0.5 leading-tight">{card.title}</span>
              <span className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{card.value}</span>
              <span className="text-[10px] font-semibold text-slate-400">{card.subtitle}</span>
            </GlassCard>
          );
        })}
      </div>

      {/* Progress Pengisian & Persentase Penyelesaian Widget */}
      <GlassCard variant="neumorph" className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center neumorph-pressed">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-700">Progress Pengisian Tamrin</span>
              <span className="text-[10px] text-slate-400 font-semibold">Tahun Ajaran 1447-1448 H</span>
            </div>
          </div>
          <span className="font-extrabold text-emerald-600 text-sm">{stats.persentase}% Selesai</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3.5 bg-slate-200/60 rounded-full overflow-hidden p-0.5 neumorph-pressed">
          <div 
            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${stats.persentase}%` }}
          />
        </div>
      </GlassCard>
    </div>
  );
};
