import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotificationStore } from '../../stores/notificationStore';
import { GlassCard } from './GlassCard';

export const NotificationRenderer = () => {
  const { toasts, confirmDialog, dismissToast } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20';
      case 'error':
        return 'from-rose-500/10 to-red-500/5 border-rose-500/20';
      case 'warning':
        return 'from-amber-500/10 to-orange-500/5 border-amber-500/20';
      default:
        return 'from-blue-500/10 to-indigo-500/5 border-blue-500/20';
    }
  };

  return (
    <>
      {/* Toast Notifications Container */}
      <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto"
            >
              <GlassCard
                variant="neumorph"
                className={`flex items-start gap-3 p-4 border bg-white/75 backdrop-blur-md rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)] border-white/60 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
              >
                {/* 3D Glass overlay */}
                <div className={`absolute inset-0 bg-linear-to-br ${getGradient(toast.type)} -z-10`} />
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-500 to-indigo-500" style={{
                  backgroundImage: toast.type === 'success' ? 'linear-gradient(to bottom, #10b981, #14b8a6)' :
                                   toast.type === 'error' ? 'linear-gradient(to bottom, #f43f5e, #ef4444)' :
                                   toast.type === 'warning' ? 'linear-gradient(to bottom, #f59e0b, #f97316)' :
                                   'linear-gradient(to bottom, #3b82f6, #6366f1)'
                }} />

                {getIcon(toast.type)}

                <div className="flex-1 pr-4">
                  <p className="text-xs font-bold text-slate-800 leading-snug">{toast.message}</p>
                </div>

                <button
                  onClick={() => dismissToast(toast.id)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialogs Container */}
      <AnimatePresence>
        {confirmDialog && confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-9998 perspective-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-full max-w-sm"
              style={{ transformStyle: "preserve-3d" }}
            >
              <GlassCard
                variant="neumorph"
                className="p-6 border border-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] relative bg-linear-to-b from-white/95 to-slate-50/90 backdrop-blur-2xl rounded-3xl overflow-hidden"
              >
                {/* 3D Depth Top & Side glows */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-linear-to-b from-white to-transparent opacity-80 pointer-events-none rounded-t-3xl" />
                <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-blue-400 to-indigo-600 rounded-l-3xl shadow-[4px_0_15px_rgba(79,70,229,0.4)]" />

                <div className="relative z-10 pl-3">
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide border-b border-slate-200/80 pb-3 mb-4 drop-shadow-sm flex items-center gap-2">
                    {confirmDialog.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-6">
                    {confirmDialog.message}
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={confirmDialog.onCancel}
                      className="px-5 py-2.5 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-white text-slate-500 font-black text-[11px] uppercase tracking-wider shadow-[0_2px_5px_rgba(0,0,0,0.05)] select-none active:translate-y-0.5 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={confirmDialog.onConfirm}
                      className="px-5 py-2.5 rounded-xl bg-linear-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-400/50 text-white font-black text-[11px] uppercase tracking-wider shadow-[0_8px_15px_-3px_rgba(59,130,246,0.5),inset_0_2px_2px_rgba(255,255,255,0.3)] select-none active:translate-y-0.5 transition-all"
                    >
                      Oke, Lanjutkan
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
