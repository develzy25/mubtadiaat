import { Outlet } from 'react-router';
import { BottomNavigation } from '../components/ui/BottomNavigation';

export const DashboardLayout = () => {
  return (
    <div className="min-h-dvh bg-[#F0F4F8] relative pb-28 flex flex-col justify-between">
      {/* Main Content Area */}
      <main className="container max-w-xl mx-auto px-4 py-6 flex-1">
        <Outlet />
      </main>

      {/* Global App Footer */}
      <footer className="w-full max-w-xl mx-auto text-center text-[9px] text-slate-400 font-medium pb-8 px-6 select-none leading-relaxed print:hidden">
        <p>
          p3hmlirboyo@gmail.com &nbsp;|&nbsp; Jl. KH. Abdul Karim Po. Box 140 Lirboyo Kediri &nbsp;|&nbsp; Telp. 0354-772197
        </p>
        <p className="mt-0.5 font-bold text-slate-500">
          P3HM LIRBOYO &copy; Copyright {new Date().getFullYear()}. All Rights Reserved
        </p>
      </footer>

      {/* Persistent Bottom Navigation for Mobile First approach */}
      <BottomNavigation />
    </div>
  );
};
