import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { EmptyState, ErrorMessage, StatusBadge } from '@/components/shared';
import { useToast } from '@/context/ToastContext';
import { useThrottle } from '@/hooks/useThrottle';
import type { Appointment, AppointmentStatus } from '@/api/types';

const TABS: { label: string; value: AppointmentStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function DoctorAppointmentsPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.doctorAppointments,
    queryFn: () => api.get<Appointment[]>('/appointments/doctor').then(r => r.data),
  });

  const confirm = useMutation({
    mutationFn: (id: string) => api.patch(`/appointments/${id}/confirm`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.doctorAppointments }); showToast('Appointment confirmed!'); },
    onError: () => showToast('Failed to confirm', 'error'),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => api.patch(`/appointments/${id}/cancel`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.doctorAppointments }); showToast('Appointment cancelled.', 'info'); },
    onError: () => showToast('Failed to cancel', 'error'),
  });

  const throttledConfirm = useThrottle((id: string) => confirm.mutate(id), 2000);
  const throttledCancel = useThrottle((id: string) => cancel.mutate(id), 2000);

  const filtered = (appointments ?? []).filter(a => tab === 'ALL' || a.status === tab);

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><SkeletonList /></div>;
  if (isError) return <div className="p-8"><ErrorMessage message="Failed to load appointments." /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-6">Patient Appointments</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              tab === t.value ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No appointments in this category." />
      ) : (
        <div className="space-y-4">
          {filtered.map(a => {
            const patientName = typeof a.patientId === 'object' ? (a.patientId as any).fullName ?? 'Patient' : 'Patient';
            return (
              <div key={a._id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{patientName}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{a.reason}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(a.date).toLocaleDateString()} ·{' '}
                      {new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                {a.status === 'PENDING' && (
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    <button onClick={() => throttledConfirm(a._id)} className="btn-primary text-xs py-1.5 px-3">Confirm</button>
                    <button onClick={() => throttledCancel(a._id)} className="btn-danger text-xs py-1.5 px-3">Cancel</button>
                    <button onClick={() => setRescheduleAppt(a)} className="btn-secondary text-xs py-1.5 px-3">Reschedule</button>
                  </div>
                )}
                {a.status === 'CONFIRMED' && (
                  <div className="flex gap-2 pt-3 border-t border-slate-800">
                    <button onClick={() => throttledCancel(a._id)} className="btn-danger text-xs py-1.5 px-3">Cancel</button>
                    <button onClick={() => setRescheduleAppt(a)} className="btn-secondary text-xs py-1.5 px-3">Reschedule</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {rescheduleAppt && (
        <RescheduleModal
          appointment={rescheduleAppt}
          onClose={() => setRescheduleAppt(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.doctorAppointments });
            setRescheduleAppt(null);
            showToast('Appointment rescheduled!');
          }}
        />
      )}
    </div>
  );
}

function RescheduleModal({ appointment, onClose, onSuccess }: {
  appointment: Appointment; onClose: () => void; onSuccess: () => void;
}) {
  const { showToast } = useToast();
  const { register, handleSubmit } = useForm<{ date: string; reason: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: any) => api.patch(`/appointments/${appointment._id}/reschedule`, data),
    onSuccess,
    onError: () => showToast('Failed to reschedule', 'error'),
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-sm w-full animate-fade-up">
        <h2 className="text-white font-semibold text-lg mb-4">Reschedule Appointment</h2>
        <form onSubmit={handleSubmit(d => mutateAsync(d))} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">New Date & Time</label>
            <input className="input-base w-full" type="datetime-local" {...register('date', { required: true })} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Reason for Reschedule</label>
            <input className="input-base w-full" placeholder="Brief reason…" {...register('reason')} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="btn-primary flex-1">
              {isPending ? 'Saving…' : 'Reschedule'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
