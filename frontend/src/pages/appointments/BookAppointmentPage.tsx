import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import { useToast } from '@/context/ToastContext';
import { Spinner } from '@/components/shared';
import type { Doctor } from '@/api/types';

interface FormValues { appointmentDate: string; reason: string; notes: string; }

export default function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: doctor, isLoading } = useQuery({
    queryKey: QUERY_KEYS.doctor(doctorId!),
    queryFn: () => api.get<Doctor>(`/doctors/${doctorId}`).then(r => r.data),
    enabled: !!doctorId,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: any) => api.post('/appointments', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.myAppointments }); },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await mutateAsync({
        doctorId,
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
      });
      showToast('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch {
      showToast('Failed to book appointment.', 'error');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const dName = (doctor as any)?.userId?.fullName ?? (doctor as any)?.fullName ?? 'Doctor';

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-2">Book Appointment</h1>
      <p className="text-slate-400 mb-2">with Dr. <span className="text-brand-400">{dName}</span></p>
      {doctor?.specialization && <p className="text-slate-500 text-sm mb-8">{doctor.specialization}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Date & Time *</label>
          <input className="input-base w-full" type="datetime-local"
            {...register('appointmentDate', { required: 'Please pick a date' })} />
          {errors.appointmentDate && <p className="text-red-400 text-xs mt-1">{errors.appointmentDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Reason *</label>
          <input className="input-base w-full" placeholder="Brief reason for visit"
            {...register('reason', { required: 'Reason is required' })} />
          {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Additional Notes</label>
          <textarea className="input-base w-full h-20 resize-none" placeholder="Any additional info…"
            {...register('notes')} />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={isPending} className="btn-primary flex-1">
            {isPending ? 'Booking…' : 'Confirm Booking'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}