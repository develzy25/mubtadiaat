import { useNetwork } from '../hooks/useNetwork';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOnline = useNetwork();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Mode Offline</span>
    </div>
  );
}
