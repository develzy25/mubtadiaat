import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PremiumButton } from './ui/PremiumButton';
import { GlassCard } from './ui/GlassCard';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <GlassCard className="max-w-md w-full flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Oops, Terjadi Kesalahan</h2>
            <p className="text-sm text-slate-500 mb-4">
              Sistem mendeteksi adanya gangguan. Silakan muat ulang halaman ini.
            </p>
            <PremiumButton 
              onClick={() => window.location.reload()}
              variant="primary"
              className="w-full"
            >
              Muat Ulang
            </PremiumButton>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
