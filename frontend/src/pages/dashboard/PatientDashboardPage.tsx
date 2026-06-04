import { usePatientDashboard } from '@/hooks/useDashboard';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { ErrorMessage, StatusBadge } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

function StatCard({ label, value, icon, color = 'brand' }: {
  label: string; value: number; icon: string; color?: 'brand' | 'blue' | 'purple';
}) {
  const bg: Record<string, string> = {
    brand: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };
  return (
    <div className={`rounded-2xl border p-5 ${bg[color]}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  );
}

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = usePatientDashboard();

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><SkeletonList count={3} /></div>;
  if (isError) return <div className="p-8"><ErrorMessage message="Failed to load dashboard." /></div>;

  const upcoming = data?.upcomingAppointments ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white">
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's your health summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Appointments" value={data?.totalAppointments ?? 0} icon="📅" color="brand" />
        <StatCard label="Prescriptions" value={data?.totalPrescriptions ?? 0} icon="💊" color="blue" />
        <StatCard label="Payments" value={data?.totalPayments ?? 0} icon="💳" color="purple" />
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Upcoming Appointments</h2>
          <Link to="/my-appointments" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
            View all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-slate-400 mb-3">No upcoming appointments.</p>
            <Link to="/doctors" className="btn-primary inline-block text-sm">
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map(appt => {
              const doctorName = typeof appt.doctorId === 'object'
                ? (appt.doctorId as any).fullName ?? 'Doctor'
                : 'Doctor';
              return (
                <div key={appt._id} className="card flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Dr. {doctorName}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{appt.reason}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(appt.date).toLocaleDateString()} ·{' '}
                      {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link to="/doctors" className="card text-center hover:border-brand-500/40 transition-colors">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-white font-medium">Find Doctors</p>
          <p className="text-slate-400 text-xs mt-1">Browse & book appointments</p>
        </Link>
        <Link to="/my-prescriptions" className="card text-center hover:border-brand-500/40 transition-colors">
          <p className="text-2xl mb-2">📋</p>
          <p className="text-white font-medium">My Prescriptions</p>
          <p className="text-slate-400 text-xs mt-1">View prescription history</p>
        </Link>
      </div>
    </div>
  );
}
