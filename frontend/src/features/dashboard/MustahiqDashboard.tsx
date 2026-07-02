import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { DashboardHeader } from './components/DashboardHeader';
import { SummaryWidget } from './components/SummaryWidget';
import { TeachingScheduleWidget } from './components/TeachingScheduleWidget';
import { QuickActionWidget } from './components/QuickActionWidget';
import { getDashboardSummary } from './services/dashboard.service';

export const MustahiqDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((err) => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Memuat Data Dashboard...</span>
      </div>
    );
  }

  const name = data?.userName || 'Pengajar';
  const role = data?.role || 'Mustahiq';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      className="pb-6 max-w-xl mx-auto"
    >
      {/* 1. Header & Greeting Card with 3D Calendar Widget */}
      <DashboardHeader name={name} role={role} />
      
      {/* 2. Ringkasan Hari Ini (4 3D Stat Cards) */}
      <SummaryWidget 
        totalSantri={data?.totalSantri || 0} 
        attendance={data?.attendance || { hadir: 0, sakit: 0, izin: 0, alpha: 0 }} 
      />
      
      {/* 3. Jadwal Mengajar Hari Ini (Timeline List from Blueprint) */}
      <TeachingScheduleWidget />

      {/* 4. Akses Cepat (4 3D Quick Buttons) */}
      <QuickActionWidget />
    </motion.div>
  );
};
