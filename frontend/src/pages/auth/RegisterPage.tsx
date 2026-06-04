import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/api/axiosInstance';

interface FormValues { fullName: string; email: string; password: string; role: 'PATIENT' | 'DOCTOR'; }

export default function RegisterPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { role: 'PATIENT' },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post('/auth/register', data);
      const res = await api.post('/auth/login', { email: data.email, password: data.password });
      login(res.data.access_token, res.data.user);
      showToast('Account created!');
      navigate(data.role === 'DOCTOR' ? '/doctor/dashboard' : '/dashboard');
    } catch {
      showToast('Registration failed. Email may already be in use.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">M</span>
          </div>
          <h1 className="font-display text-3xl text-white">Create Account</h1>
          <p className="text-slate-400 mt-1">Join MediBook today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <input className="input-base w-full" placeholder="Dr. John Smith"
              {...register('fullName', { required: true })} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input className="input-base w-full" type="email" placeholder="you@example.com"
              {...register('email', { required: true })} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input className="input-base w-full" type="password" placeholder="••••••••"
              {...register('password', { required: true, minLength: 6 })} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">I am a…</label>
            <div className="grid grid-cols-2 gap-3">
              {(['PATIENT', 'DOCTOR'] as const).map(role => (
                <label key={role} className="cursor-pointer">
                  <input type="radio" className="sr-only" value={role} {...register('role')} />
                  <div className="card text-center py-3 hover:border-brand-500/40 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-500/5">
                    <p className="text-white text-sm font-medium">{role === 'PATIENT' ? '🤒 Patient' : '🩺 Doctor'}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
