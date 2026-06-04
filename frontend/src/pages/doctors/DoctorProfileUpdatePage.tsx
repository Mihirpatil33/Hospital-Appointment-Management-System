import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axiosInstance';
import { useToast } from '@/context/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';

interface FormValues {
  specialization: string;
  experience: number;
  bio: string;
  consultationFee: number;
  availableTime: string;
}

export default function DoctorProfileUpdatePage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();

  const { mutateAsync } = useMutation({
    mutationFn: (data: FormValues) => api.patch('/doctors/profile', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.doctors }); },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await mutateAsync(data);
      showToast('Profile updated!');
      navigate('/doctor/dashboard');
    } catch {
      showToast('Failed to update profile', 'error');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-2">Update Profile</h1>
      <p className="text-slate-400 mb-8">Keep your profile information current.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Specialization</label>
          <input className="input-base w-full" placeholder="e.g. Cardiology"
            {...register('specialization')} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Experience (years)</label>
          <input className="input-base w-full" type="number" placeholder="5"
            {...register('experience', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Bio</label>
          <textarea className="input-base w-full h-24 resize-none" placeholder="About yourself…"
            {...register('bio')} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Consultation Fee (₹)</label>
          <input className="input-base w-full" type="number" placeholder="500"
            {...register('consultationFee', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Available Time</label>
          <input className="input-base w-full" placeholder="e.g. 9 AM – 5 PM"
            {...register('availableTime')} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : 'Save Profile'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
