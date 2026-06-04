import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/api/axiosInstance';

interface FormValues { email: string; password: string; }

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.access_token, res.data.user);
      showToast('Welcome back!');
      navigate(res.data.user.role === 'DOCTOR' ? '/doctor/dashboard' : '/dashboard');
    } catch {
      showToast('Invalid email or password', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">M</span>
          </div>
          <h1 className="font-display text-3xl text-white">MediBook</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input className="input-base w-full" type="email" placeholder="you@example.com"
              {...register('email', { required: true })} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input className="input-base w-full" type="password" placeholder="••••••••"
              {...register('password', { required: true })} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-4">
          No account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300">Register</Link>
        </p>
      </div>
    </div>
  );
}
