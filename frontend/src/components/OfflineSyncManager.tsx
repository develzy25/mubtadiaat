import { useEffect, useState } from 'react';
import { offlineDb } from '../lib/offlineDb';
import { CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export function OfflineSyncManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [syncResult, setSyncResult] = useState<'success' | 'error' | null>(null);

  const checkQueue = async () => {
    const count = await offlineDb.syncQueue.where('status').equals('PENDING').count();
    setQueueCount(count);
  };

  useEffect(() => {
    checkQueue();
    // Watch dexie table for changes if possible, or just poll
    const interval = setInterval(checkQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const processSyncQueue = async () => {
    if (!navigator.onLine || syncing) return;
    
    const tasks = await offlineDb.syncQueue.where('status').equals('PENDING').toArray();
    if (tasks.length === 0) return;

    setSyncing(true);
    setSyncResult(null);

    let allSuccess = true;
    for (const task of tasks) {
      try {
        const headers = task.headers ? JSON.parse(task.headers) : { 'Content-Type': 'application/json' };
        // Attach current token if needed
        const token = localStorage.getItem('better-auth.session_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(task.url, {
          method: task.method,
          headers,
          body: task.body
        });

        if (res.ok) {
          await offlineDb.syncQueue.delete(task.id!);
        } else {
          allSuccess = false;
          await offlineDb.syncQueue.update(task.id!, {
            retryCount: task.retryCount + 1
          });
        }
      } catch (err) {
        allSuccess = false;
        await offlineDb.syncQueue.update(task.id!, {
          retryCount: task.retryCount + 1
        });
      }
    }

    setSyncing(false);
    setSyncResult(allSuccess ? 'success' : 'error');
    checkQueue();

    setTimeout(() => {
      setSyncResult(null);
    }, 5000);
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && queueCount === 0 && !syncing && !syncResult) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div className={`p-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] flex items-center gap-3 backdrop-blur-xl border ${
        !isOnline ? 'bg-amber-500/20 border-amber-500/40 text-amber-700' :
        syncing ? 'bg-blue-500/20 border-blue-500/40 text-blue-700' :
        syncResult === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700' :
        'bg-red-500/20 border-red-500/40 text-red-700'
      }`}>
        
        {!isOnline && (
          <>
            <CloudOff className="w-5 h-5 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Mode Offline</span>
              {queueCount > 0 && <span className="text-xs opacity-80">{queueCount} data menunggu sinkronisasi</span>}
            </div>
          </>
        )}

        {isOnline && syncing && (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Menyinkronkan Data</span>
              <span className="text-xs opacity-80">Harap jangan tutup aplikasi...</span>
            </div>
          </>
        )}

        {isOnline && !syncing && syncResult === 'success' && (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Sinkronisasi Selesai</span>
              <span className="text-xs opacity-80">Semua data berhasil diunggah</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
