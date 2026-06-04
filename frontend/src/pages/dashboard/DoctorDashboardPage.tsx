import { useDoctorDashboard } from '@/hooks/useDashboard';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { ErrorMessage, StatusBadge } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

function StatCard({ label, value, icon, sub }: {
  label: string; value: number | string; icon: string; sub?: string;
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className="text-white text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDoctorDashboard();

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><SkeletonList count={3} /></div>;
  if (isError) return <div className="p-8"><ErrorMessage message="Failed to load dashboard." /></div>;

  const upcoming = data?.upcomingAppointments ?? [];
  const avgRating = data?.averageRating ? data.averageRating.toFixed(1) : '—';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white">
          Dr. {user?.fullName?.split(' ')[0]}'s Dashboard 🩺
        </h1>
        <p className="text-slate-400 mt-1">Your practice at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatCard label="Total Appointments" value={data?.totalAppointments ?? 0} icon="📅" />
        <StatCard label="Total Patients" value={data?.totalPatients ?? 0} icon="👥" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card bg-yellow-500/5 border-yellow-500/20">
          <p className="text-yellow-400 text-xs uppercase tracking-wider mb-1">Pending</p>
          <p className="text-white text-2xl font-bold">{data?.pendingCount ?? 0}</p>
        </div>
        <div className="card bg-brand-500/5 border-brand-500/20">
          <p className="text-brand-400 text-xs uppercase tracking-wider mb-1">Confirmed</p>
          <p className="text-white text-2xl font-bold">{data?.confirmedCount ?? 0}</p>
        </div>
        <div className="card bg-blue-500/5 border-blue-500/20">
          <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">Completed</p>
          <p className="text-white text-2xl font-bold">{data?.completedCount ?? 0}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="card flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center">
          <span className="text-yellow-400 text-2xl">★</span>
        </div>
        <div>
          <p className="text-white text-2xl font-bold">{avgRating}</p>
          <p className="text-slate-400 text-sm">Average Patient Rating</p>
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Upcoming Appointments</h2>
          <Link to="/doctor/appointments" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
            Manage all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-slate-400">No upcoming appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map(appt => {
              const patientName = typeof appt.patientId === 'object'
                ? (appt.patientId as any).fullName ?? 'Patient'
                : 'Patient';
              return (
                <div key={appt._id} className="card flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{patientName}</p>
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
        <Link to="/doctor/prescriptions/create" className="card text-center hover:border-brand-500/40 transition-colors">
          <p className="text-2xl mb-2">📝</p>
          <p className="text-white font-medium">Create Prescription</p>
          <p className="text-slate-400 text-xs mt-1">Write for a patient</p>
        </Link>
        <Link to="/doctor/appointments" className="card text-center hover:border-brand-500/40 transition-colors">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-white font-medium">Manage Appointments</p>
          <p className="text-slate-400 text-xs mt-1">Confirm, cancel, reschedule</p>
        </Link>
      </div>
    </div>
  );
}
