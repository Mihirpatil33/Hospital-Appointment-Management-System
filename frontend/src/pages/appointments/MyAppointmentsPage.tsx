import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { EmptyState, ErrorMessage, StatusBadge } from '@/components/shared';
import type { Appointment } from '@/api/types';
import { Link } from 'react-router-dom';

export default function MyAppointmentsPage() {
  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.myAppointments,
    queryFn: () => api.get<Appointment[]>('/appointments/my-appointments').then(r => r.data),
  });

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><SkeletonList /></div>;
  if (isError) return <div className="p-8"><ErrorMessage message="Failed to load appointments." /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-8">My Appointments</h1>

      {!appointments?.length ? (
        <EmptyState message="No appointments yet." />
      ) : (
        <div className="space-y-4">
          {appointments.map(a => {
            const doctorName = typeof a.doctorId === 'object'
             ? (a.doctorId as any).userId?.fullName ?? 'Doctor'
              : 'Doctor';
            return (
              <div key={a._id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">Dr. {doctorName}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{a.reason}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(a.appointmentDate).toLocaleDateString()} ·{' '}
                      {new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                {(a.status === 'CONFIRMED' || a.status === 'COMPLETED') && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                    <Link to="/payments" className="text-brand-400 text-xs hover:text-brand-300">
                      Pay →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
