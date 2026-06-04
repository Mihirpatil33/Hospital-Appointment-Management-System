import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pb-16">
        <Outlet />
      </main>
    </div>
  );
}
