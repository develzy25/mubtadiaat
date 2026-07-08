import { useState } from 'react';
import { Users, History, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui';

import { SantriTab } from './santri/SantriTab';
import { AlumniTab } from './santri/AlumniTab';
import { SyncTab } from './santri/SyncTab';

export const AdminSantriPage = () => {
  const [activeTab, setActiveTab] = useState<'santri' | 'alumni' | 'sync'>('santri');

  return (
    <div className="space-y-6">
      {/* 3D Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GlassCard className="relative overflow-hidden p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-blue-500/20 to-cyan-500/0 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-linear-to-tr from-blue-600 to-cyan-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] border border-blue-400/30">
                <Users className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Master Santri & Alumni</h1>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                  Pusat Data Santri Putri Mubtadi'aat
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs Navigation within Header */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200/50 pb-0">
            <button
              onClick={() => setActiveTab('santri')}
              className={`px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'santri' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Database Santri
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'alumni' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
              }`}
            >
              <History className="w-4 h-4" />
              Arsip & Alumni
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`px-4 py-2 font-black text-[11px] uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'sync' 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Integrasi Excel
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tab Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'santri' && <SantriTab />}
          {activeTab === 'alumni' && <AlumniTab />}
          {activeTab === 'sync' && <SyncTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
