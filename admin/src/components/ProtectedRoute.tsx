import { Navigate, Outlet } from 'react-router';
import { useSession } from '../lib/auth.client';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="text-slate-500 font-medium">Memuat Sesi...</span>
      </div>
    );
  }

  // If we don't have a session data, redirect to login
  if (!data?.session) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the child routes (e.g., Dashboard Layout)
  return <Outlet />;
};
