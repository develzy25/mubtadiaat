import { useState, useEffect } from 'react';
import { 
  Users, 
  UserMinus, 
  UserCheck, 
  School,
  ArrowRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { fetchStats } from '../services/admin.service';
import { GlassCard } from '../components/ui';
import { Link } from 'react-router';

// Simple Equalizer Animation Component
const LiveEqualizer = () => {
  return (
    <div className="flex items-end gap-1 h-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-blue-500 rounded-t-sm"
          animate={{ height: ['20%', '80%', '40%', '100%', '30%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulation of username. In a real app, this comes from AuthContext.
  const activeUser = "Ustadz Haris"; 

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">
          Menginisialisasi Sistem...
        </p>
      </div>
    );
  }

  const { metrics, recentActivities, attendanceTrends } = stats || {
    metrics: { active: 0, boyong: 0, cuti: 0, classes: 0 },
    recentActivities: [],
    attendanceTrends: []
  };

  const cards = [
    {
      title: 'Santri Putri Aktif',
      value: metrics.active,
      sub: 'Tercatat aktif saat ini',
      icon: <Users className="w-6 h-6 text-white" />,
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
    },
    {
      title: 'Santri Cuti',
      value: metrics.cuti,
      sub: 'Izin cuti sementara',
      icon: <UserCheck className="w-6 h-6 text-white" />,
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.3)]'
    },
    {
      title: 'Alumni / Boyong',
      value: metrics.boyong,
      sub: 'Tidak aktif / Lulus',
      icon: <UserMinus className="w-6 h-6 text-white" />,
      gradient: 'from-rose-400 to-red-500',
      shadow: 'shadow-[0_8px_20px_rgba(225,29,72,0.3)]'
    },
    {
      title: 'Total Rombel',
      value: metrics.classes,
      sub: 'Rombongan Belajar Aktif',
      icon: <School className="w-6 h-6 text-white" />,
      gradient: 'from-emerald-400 to-teal-500',
      shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.3)]'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* 3D Welcome Banner */}
      <motion.div variants={itemVariants}>
        <GlassCard className="relative overflow-hidden p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-blue-400/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-emerald-400/10 to-teal-500/0 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-3">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Sistem Terenkripsi & Aktif</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">
                Selamat Datang, <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">{activeUser}</span>
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-2">
                Pusat Kendali Administrasi Madrasah MPHM Lirboyo
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white shadow-sm backdrop-blur-md">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Server</p>
                <p className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online & Stabil
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aktivitas Jaringan</p>
                <LiveEqualizer />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <GlassCard 
              className={`p-6 border-white/40 overflow-hidden relative group`}
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-linear-to-br ${card.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.title}</p>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${card.gradient} flex items-center justify-center ${card.shadow} shrink-0`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wide relative z-10">
                {card.sub}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Graph */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-6 h-full flex flex-col justify-between border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-50/50 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Tren Presensi Santri</h3>
                </div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Rata-rata: {attendanceTrends?.length > 0 ? '98.0%' : '0.0%'}
                </span>
              </div>
            </div>

            {/* Live SVG Line Chart with Framer Motion */}
            <div className="relative w-full h-56 mt-4 flex items-end z-10">
              {attendanceTrends?.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                  Belum ada data presensi
                </div>
              ) : (
                <>
                  <svg className="w-full h-full drop-shadow-md" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Animated Grid Lines */}
                {[30, 75, 120].map((y, i) => (
                  <motion.line 
                    key={i}
                    initial={{ x2: 0 }}
                    animate={{ x2: 500 }}
                    transition={{ duration: 1, delay: 0.2 * i }}
                    x1="0" y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,4" 
                  />
                ))}

                {/* Animated Area */}
                <motion.path
                  initial={{ opacity: 0, d: "M 10 150 L 150 150 L 300 150 L 450 150 L 490 150 L 490 150 L 10 150 Z" }}
                  animate={{ opacity: 1, d: "M 10 120 C 50 110, 100 130, 150 100 C 200 70, 250 85, 300 50 C 350 15, 400 45, 450 30 C 475 22.5, 490 25, 490 150 L 10 150 Z" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  fill="url(#chartGrad)"
                />

                {/* Animated Line */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M 10 120 C 50 110, 100 130, 150 100 C 200 70, 250 85, 300 50 C 350 15, 400 45, 450 30 C 475 22.5, 490 25, 490 25"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Animated Dots */}
                {[
                  { cx: 10, cy: 120 },
                  { cx: 150, cy: 100 },
                  { cx: 300, cy: 50 },
                  { cx: 450, cy: 30 }
                ].map((dot, i) => (
                  <motion.circle 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                    cx={dot.cx} cy={dot.cy} r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" 
                  />
                ))}
              </svg>

              {/* Labels */}
              <div className="absolute bottom-0 left-4 right-4 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {attendanceTrends.map((t: any) => (
                  <span key={t.month}>{t.month} ({t.rate}%)</span>
                ))}
              </div>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 h-full flex flex-col justify-between border-white/50">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Live Audit Log</h3>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-56 pr-1 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
              <AnimatePresence>
                {recentActivities.map((act: any, idx: number) => (
                  <motion.div 
                    key={act.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 pl-0 py-1 relative z-10 group"
                  >
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-normal truncate">{act.details || act.action}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {act.userName} &bull; {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {recentActivities.length === 0 && (
                <p className="text-xs text-slate-400 font-bold text-center py-6 uppercase tracking-wider">Log Kosong</p>
              )}
            </div>

            <Link 
              to="/admin/logs" 
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all border border-slate-200/50 hover:border-indigo-200"
            >
              Lihat Selengkapnya
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Menu */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Pintasan Manajemen Utama</h3>
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest hidden md:inline-block">Alur Pengisian Data</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Master Asatidz */}
            <Link to="/asatidz" className="p-4 rounded-xl border border-slate-200/50 bg-white/40 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 flex flex-col justify-between group transition-all relative overflow-hidden h-36">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              <div>
                <p className="text-xs font-black text-slate-700 uppercase">1. Master Pengurus</p>
                <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (metrics?.usersCount || 0) * 10)}%` }}></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">Data Terisi: {metrics?.usersCount || 0}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Isi Data</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>

            {/* 2. Master Kamar */}
            <Link to="/blok-kamar" className="p-4 rounded-xl border border-slate-200/50 bg-white/40 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 flex flex-col justify-between group transition-all relative overflow-hidden h-36">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              <div>
                <p className="text-xs font-black text-slate-700 uppercase">2. Master Kamar</p>
                <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (metrics?.kamarCount || 0) * 5)}%` }}></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">Data Terisi: {metrics?.kamarCount || 0}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Isi Data</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>

            {/* 3. Master Kelas */}
            <Link to="/kelas-rombel" className="p-4 rounded-xl border border-slate-200/50 bg-white/40 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 flex flex-col justify-between group transition-all relative overflow-hidden h-36">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              <div>
                <p className="text-xs font-black text-slate-700 uppercase">3. Kelas & Rombel</p>
                <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (metrics?.classes || 0) * 10)}%` }}></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">Data Terisi: {metrics?.classes || 0}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Isi Data</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>

            {/* 4. Santri */}
            <Link to="/santri" className="p-4 rounded-xl border border-slate-200/50 bg-white/40 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 flex flex-col justify-between group transition-all relative overflow-hidden h-36">
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-100/50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
              <div>
                <p className="text-xs font-black text-slate-700 uppercase">4. Database Santri</p>
                <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (metrics?.santriCount || 0) * 2)}%` }}></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">Data Terisi: {metrics?.santriCount || 0}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-rose-600 uppercase">Isi Data</span>
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4 text-rose-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>

          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
